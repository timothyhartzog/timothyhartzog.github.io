/**
 * ui.js — DOM rendering helpers shared across pages.
 *
 * Renders the auth bar (login button / avatar + logout) and provides
 * utility functions for the post editor and user manager pages.
 */

const UI = (() => {
  // ── Google Client ID ─────────────────────────────────────────────────
  // Replace this with your own Google OAuth 2.0 Client ID.
  // Create one at https://console.cloud.google.com/apis/credentials
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

  // ── Auth bar ─────────────────────────────────────────────────────────

  function renderAuthBar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    WasmApp.onSessionChange((session) => {
      if (session && session.logged_in) {
        container.innerHTML = `
          <div class="auth-bar authenticated">
            <img src="${escapeHtml(session.picture)}" alt="" class="avatar" referrerpolicy="no-referrer" />
            <span class="user-name">${escapeHtml(session.name)}</span>
            <span class="user-role badge bg-secondary">${escapeHtml(session.role)}</span>
            <button class="btn btn-sm btn-outline-danger" id="btn-logout">Sign out</button>
          </div>`;
        document.getElementById("btn-logout").addEventListener("click", () => {
          WasmApp.logout();
          window.location.reload();
        });
      } else {
        container.innerHTML = `
          <div class="auth-bar">
            <div id="g_id_onload"
                 data-client_id="${GOOGLE_CLIENT_ID}"
                 data-callback="handleGoogleCredential"
                 data-auto_prompt="false">
            </div>
            <div class="g_id_signin"
                 data-type="standard"
                 data-size="large"
                 data-theme="outline"
                 data-text="sign_in_with"
                 data-shape="rectangular"
                 data-logo_alignment="left">
            </div>
          </div>`;
        // Re-render Google button
        if (window.google && google.accounts) {
          google.accounts.id.renderButton(
            container.querySelector(".g_id_signin"),
            { theme: "outline", size: "large" }
          );
        }
      }
    });
  }

  // ── Posts rendering ──────────────────────────────────────────────────

  function renderPostsList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const posts = WasmApp.listPosts();
    const session = WasmApp.getSession();
    const canEdit = session && session.logged_in && (session.role === "admin" || session.role === "editor");

    if (!posts || posts.length === 0) {
      container.innerHTML = '<p class="text-muted">No posts yet.</p>';
      return;
    }

    container.innerHTML = posts
      .map(
        (p) => `
      <div class="card mb-3 post-card" data-id="${escapeAttr(p.id)}">
        <div class="card-body">
          <h5 class="card-title">${escapeHtml(p.title)}</h5>
          <p class="card-text">${escapeHtml(p.content)}</p>
          <small class="text-muted">
            By ${escapeHtml(p.author_email)} &middot;
            ${new Date(p.created_at).toLocaleDateString()}
          </small>
          ${
            canEdit
              ? `<div class="mt-2">
                   <button class="btn btn-sm btn-outline-primary btn-edit-post" data-id="${escapeAttr(p.id)}">Edit</button>
                   <button class="btn btn-sm btn-outline-danger btn-delete-post" data-id="${escapeAttr(p.id)}">Delete</button>
                 </div>`
              : ""
          }
        </div>
      </div>`
      )
      .join("");

    // Wire up edit/delete buttons
    container.querySelectorAll(".btn-edit-post").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const post = WasmApp.getPost(id);
        if (post && !post.error) {
          document.getElementById("post-id").value = post.id;
          document.getElementById("post-title").value = post.title;
          document.getElementById("post-content").value = post.content;
          document.getElementById("editor-heading").textContent = "Edit Post";
          document.getElementById("post-editor").scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    container.querySelectorAll(".btn-delete-post").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Delete this post?")) {
          const result = WasmApp.deletePost(btn.dataset.id);
          if (result && result.error) {
            alert(result.error);
          } else {
            renderPostsList(containerId);
          }
        }
      });
    });
  }

  // ── Users rendering ──────────────────────────────────────────────────

  function renderUsersList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = WasmApp.listUsers();
    if (data && data.error) {
      container.innerHTML = `<p class="text-danger">${escapeHtml(data.error)}</p>`;
      return;
    }

    const users = data || [];
    if (users.length === 0) {
      container.innerHTML = '<p class="text-muted">No users yet.</p>';
      return;
    }

    const session = WasmApp.getSession();

    container.innerHTML = `
      <table class="table table-striped">
        <thead>
          <tr><th>User</th><th>Email</th><th>Role</th><th>Actions</th></tr>
        </thead>
        <tbody>
          ${users
            .map(
              (u) => `
            <tr>
              <td>
                <img src="${escapeHtml(u.picture)}" alt="" class="avatar-sm" referrerpolicy="no-referrer" />
                ${escapeHtml(u.name)}
              </td>
              <td>${escapeHtml(u.email)}</td>
              <td>
                <select class="form-select form-select-sm role-select" data-email="${escapeAttr(u.email)}"
                        ${u.email === session.email ? "disabled" : ""}>
                  <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
                  <option value="editor" ${u.role === "editor" ? "selected" : ""}>Editor</option>
                  <option value="viewer" ${u.role === "viewer" ? "selected" : ""}>Viewer</option>
                </select>
              </td>
              <td>
                ${
                  u.email !== session.email
                    ? `<button class="btn btn-sm btn-outline-danger btn-remove-user" data-email="${escapeAttr(u.email)}">Remove</button>`
                    : "<em>You</em>"
                }
              </td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>`;

    // Role change
    container.querySelectorAll(".role-select").forEach((sel) => {
      sel.addEventListener("change", () => {
        const result = WasmApp.setUserRole(sel.dataset.email, sel.value);
        if (result && result.error) {
          alert(result.error);
          renderUsersList(containerId);
        }
      });
    });

    // Remove user
    container.querySelectorAll(".btn-remove-user").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm(`Remove user ${btn.dataset.email}?`)) {
          const result = WasmApp.removeUser(btn.dataset.email);
          if (result && result.error) {
            alert(result.error);
          }
          renderUsersList(containerId);
        }
      });
    });
  }

  // ── Sanitisation helpers ─────────────────────────────────────────────

  function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  return {
    GOOGLE_CLIENT_ID,
    renderAuthBar,
    renderPostsList,
    renderUsersList,
    escapeHtml,
    escapeAttr,
  };
})();

/** Global callback for Google Identity Services. */
function handleGoogleCredential(response) {
  WasmApp.onGoogleLogin(response);
  window.location.reload();
}

window.UI = UI;
window.handleGoogleCredential = handleGoogleCredential;
