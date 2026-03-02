/**
 * app.js — Glue layer between the WASM module, Google Auth, and the DOM.
 *
 * Provides:
 *   window.WasmApp.init()          – load WASM + restore session
 *   window.WasmApp.onGoogleLogin() – called by Google Identity Services callback
 *   window.WasmApp.logout()
 *   window.WasmApp.createPost(title, content)
 *   window.WasmApp.updatePost(id, title, content)
 *   window.WasmApp.deletePost(id)
 *   window.WasmApp.listPosts()
 *   window.WasmApp.getPost(id)
 *   window.WasmApp.listUsers()
 *   window.WasmApp.setUserRole(email, role)
 *   window.WasmApp.removeUser(email)
 */

const WasmApp = (() => {
  let app = null;       // WASM App instance
  let session = null;   // current session object
  const listeners = []; // session-change listeners

  // ── Helpers ──────────────────────────────────────────────────────────

  function notify() {
    listeners.forEach((fn) => fn(session));
  }

  function parseJSON(str) {
    try { return JSON.parse(str); }
    catch { return null; }
  }

  // ── Public API ───────────────────────────────────────────────────────

  /** Initialise the WASM module and restore any existing session. */
  async function init() {
    const wasm = await import("../wasm/wasm_posts.js");
    await wasm.default();
    app = new wasm.App();
    session = parseJSON(app.restore_session()) || { logged_in: false };
    notify();
    return session;
  }

  /** Called by the Google Identity Services callback. */
  function onGoogleLogin(credentialResponse) {
    const payload = _decodeJwt(credentialResponse.credential);
    if (!payload) {
      console.error("Failed to decode Google JWT");
      return;
    }
    const result = app.login_with_google(
      payload.email,
      payload.name || payload.email,
      payload.picture || "",
      payload.sub
    );
    session = parseJSON(result) || session;
    notify();
  }

  /** Log out and clear session. */
  function logout() {
    const result = app.logout();
    session = parseJSON(result) || { logged_in: false };
    // Revoke Google session
    if (window.google && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
    notify();
  }

  /** Decode the payload (middle part) of a JWT. No signature verification
   *  is done here – Google's library already verified the token. */
  function _decodeJwt(token) {
    try {
      const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  // ── Posts ────────────────────────────────────────────────────────────

  function createPost(title, content) {
    if (!session?.logged_in) return { error: "Not logged in" };
    return parseJSON(app.create_post(title, content, session.email));
  }

  function updatePost(id, title, content) {
    if (!session?.logged_in) return { error: "Not logged in" };
    return parseJSON(app.update_post(id, title, content, session.email));
  }

  function deletePost(id) {
    if (!session?.logged_in) return { error: "Not logged in" };
    return parseJSON(app.delete_post(id, session.email));
  }

  function listPosts() {
    return parseJSON(app.list_posts()) || [];
  }

  function getPost(id) {
    return parseJSON(app.get_post(id));
  }

  // ── Users ────────────────────────────────────────────────────────────

  function listUsers() {
    if (!session?.logged_in) return { error: "Not logged in" };
    return parseJSON(app.list_users(session.email));
  }

  function setUserRole(email, role) {
    if (!session?.logged_in) return { error: "Not logged in" };
    return parseJSON(app.set_user_role(session.email, email, role));
  }

  function removeUser(email) {
    if (!session?.logged_in) return { error: "Not logged in" };
    return parseJSON(app.remove_user(session.email, email));
  }

  // ── Session helpers ──────────────────────────────────────────────────

  function getSession() {
    return session;
  }

  function onSessionChange(fn) {
    listeners.push(fn);
  }

  // ── Expose ───────────────────────────────────────────────────────────

  return {
    init,
    onGoogleLogin,
    logout,
    getSession,
    onSessionChange,
    createPost,
    updatePost,
    deletePost,
    listPosts,
    getPost,
    listUsers,
    setUserRole,
    removeUser,
  };
})();

window.WasmApp = WasmApp;
