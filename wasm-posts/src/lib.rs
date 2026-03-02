use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

mod post_manager;
mod user_manager;

pub use post_manager::PostManager;
pub use user_manager::UserManager;

/// Storage keys
const POSTS_STORAGE_KEY: &str = "wasm_posts_data";
const USERS_STORAGE_KEY: &str = "wasm_users_data";
const SESSION_STORAGE_KEY: &str = "wasm_session_data";

/// Get localStorage from the browser
fn get_local_storage() -> Option<web_sys::Storage> {
    web_sys::window()?.local_storage().ok()?
}

/// Save data to localStorage
fn save_to_storage(key: &str, data: &str) -> Result<(), String> {
    let storage = get_local_storage().ok_or("localStorage not available")?;
    storage
        .set_item(key, data)
        .map_err(|_| "Failed to write to localStorage".to_string())
}

/// Load data from localStorage
fn load_from_storage(key: &str) -> Option<String> {
    let storage = get_local_storage()?;
    storage.get_item(key).ok()?
}

// ─── App State (exposed to JS) ────────────────────────────────────────────

#[wasm_bindgen]
pub struct App {
    post_manager: PostManager,
    user_manager: UserManager,
}

#[wasm_bindgen]
impl App {
    /// Create a new App instance, loading persisted state from localStorage.
    #[wasm_bindgen(constructor)]
    pub fn new() -> App {
        let post_manager = PostManager::load();
        let user_manager = UserManager::load();
        App {
            post_manager,
            user_manager,
        }
    }

    // ── Authentication ──────────────────────────────────────────────────

    /// Process a Google ID token: verify claims client-side, register the
    /// user if new, and start a session. Returns a JSON session object.
    pub fn login_with_google(&mut self, email: &str, name: &str, picture: &str, google_sub: &str) -> String {
        let user = self.user_manager.find_or_create_user(email, name, picture, google_sub);
        let session = Session {
            email: user.email.clone(),
            name: user.name.clone(),
            picture: user.picture.clone(),
            role: user.role.clone(),
            logged_in: true,
        };
        let json = serde_json::to_string(&session).unwrap_or_default();
        let _ = save_to_storage(SESSION_STORAGE_KEY, &json);
        json
    }

    /// Log the current user out and clear the session.
    pub fn logout(&self) -> String {
        let session = Session {
            email: String::new(),
            name: String::new(),
            picture: String::new(),
            role: String::new(),
            logged_in: false,
        };
        let json = serde_json::to_string(&session).unwrap_or_default();
        let _ = save_to_storage(SESSION_STORAGE_KEY, &json);
        json
    }

    /// Restore a session from localStorage (call on page load).
    pub fn restore_session(&self) -> String {
        load_from_storage(SESSION_STORAGE_KEY).unwrap_or_else(|| {
            serde_json::to_string(&Session {
                email: String::new(),
                name: String::new(),
                picture: String::new(),
                role: String::new(),
                logged_in: false,
            })
            .unwrap_or_default()
        })
    }

    // ── Posts ────────────────────────────────────────────────────────────

    /// Create a new post. Returns the post as JSON.
    pub fn create_post(&mut self, title: &str, content: &str, author_email: &str) -> String {
        if !self.user_manager.can_create_posts(author_email) {
            return r#"{"error":"Permission denied: you cannot create posts"}"#.to_string();
        }
        let post = self.post_manager.create(title, content, author_email);
        serde_json::to_string(&post).unwrap_or_default()
    }

    /// Update an existing post. Returns updated post JSON.
    pub fn update_post(&mut self, post_id: &str, title: &str, content: &str, editor_email: &str) -> String {
        if !self.user_manager.can_edit_posts(editor_email) {
            return r#"{"error":"Permission denied: you cannot edit posts"}"#.to_string();
        }
        match self.post_manager.update(post_id, title, content) {
            Some(post) => serde_json::to_string(&post).unwrap_or_default(),
            None => r#"{"error":"Post not found"}"#.to_string(),
        }
    }

    /// Delete a post. Returns success/error JSON.
    pub fn delete_post(&mut self, post_id: &str, editor_email: &str) -> String {
        if !self.user_manager.can_edit_posts(editor_email) {
            return r#"{"error":"Permission denied: you cannot delete posts"}"#.to_string();
        }
        if self.post_manager.delete(post_id) {
            r#"{"success":true}"#.to_string()
        } else {
            r#"{"error":"Post not found"}"#.to_string()
        }
    }

    /// Get a single post by ID. Returns JSON.
    pub fn get_post(&self, post_id: &str) -> String {
        match self.post_manager.get(post_id) {
            Some(post) => serde_json::to_string(&post).unwrap_or_default(),
            None => r#"{"error":"Post not found"}"#.to_string(),
        }
    }

    /// List all posts. Returns JSON array.
    pub fn list_posts(&self) -> String {
        let posts = self.post_manager.list();
        serde_json::to_string(&posts).unwrap_or_default()
    }

    // ── User management ─────────────────────────────────────────────────

    /// List all users (admin only). Returns JSON array.
    pub fn list_users(&self, requester_email: &str) -> String {
        if !self.user_manager.is_admin(requester_email) {
            return r#"{"error":"Permission denied: admin only"}"#.to_string();
        }
        let users = self.user_manager.list();
        serde_json::to_string(&users).unwrap_or_default()
    }

    /// Set a user's role (admin only). Returns updated user JSON.
    pub fn set_user_role(&mut self, requester_email: &str, target_email: &str, role: &str) -> String {
        if !self.user_manager.is_admin(requester_email) {
            return r#"{"error":"Permission denied: admin only"}"#.to_string();
        }
        match self.user_manager.set_role(target_email, role) {
            Some(user) => serde_json::to_string(&user).unwrap_or_default(),
            None => r#"{"error":"User not found"}"#.to_string(),
        }
    }

    /// Remove a user (admin only).
    pub fn remove_user(&mut self, requester_email: &str, target_email: &str) -> String {
        if !self.user_manager.is_admin(requester_email) {
            return r#"{"error":"Permission denied: admin only"}"#.to_string();
        }
        if self.user_manager.remove(target_email) {
            r#"{"success":true}"#.to_string()
        } else {
            r#"{"error":"User not found"}"#.to_string()
        }
    }
}

// ─── Session ───────────────────────────────────────────────────────────────

#[derive(Serialize, Deserialize, Clone)]
pub struct Session {
    pub email: String,
    pub name: String,
    pub picture: String,
    pub role: String,
    pub logged_in: bool,
}
