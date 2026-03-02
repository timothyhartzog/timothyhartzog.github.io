use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::{load_from_storage, save_to_storage, USERS_STORAGE_KEY};

/// Roles: "admin", "editor", "viewer"
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub email: String,
    pub name: String,
    pub picture: String,
    pub google_sub: String,
    pub role: String,
    pub created_at: f64,
}

#[derive(Serialize, Deserialize, Default)]
pub struct UserManager {
    users: HashMap<String, User>,
    /// If true, the first user to sign in becomes admin.
    first_user_is_admin: bool,
}

impl UserManager {
    /// Load from localStorage or start fresh.
    pub fn load() -> Self {
        if let Some(data) = load_from_storage(USERS_STORAGE_KEY) {
            serde_json::from_str(&data).unwrap_or_default()
        } else {
            Self {
                users: HashMap::new(),
                first_user_is_admin: true,
            }
        }
    }

    /// Persist current state to localStorage.
    fn save(&self) {
        if let Ok(json) = serde_json::to_string(self) {
            let _ = save_to_storage(USERS_STORAGE_KEY, &json);
        }
    }

    fn now() -> f64 {
        js_sys::Date::now()
    }

    /// Look up a user by email, or create a new one.
    /// The very first user is automatically made admin.
    pub fn find_or_create_user(
        &mut self,
        email: &str,
        name: &str,
        picture: &str,
        google_sub: &str,
    ) -> User {
        if let Some(user) = self.users.get(email) {
            return user.clone();
        }

        let role = if self.users.is_empty() && self.first_user_is_admin {
            "admin".to_string()
        } else {
            "viewer".to_string()
        };

        let user = User {
            email: email.to_string(),
            name: name.to_string(),
            picture: picture.to_string(),
            google_sub: google_sub.to_string(),
            role,
            created_at: Self::now(),
        };
        self.users.insert(email.to_string(), user.clone());
        self.save();
        user
    }

    /// Check if a user has admin role.
    pub fn is_admin(&self, email: &str) -> bool {
        self.users
            .get(email)
            .map(|u| u.role == "admin")
            .unwrap_or(false)
    }

    /// Check if a user can create posts (admin or editor).
    pub fn can_create_posts(&self, email: &str) -> bool {
        self.users
            .get(email)
            .map(|u| u.role == "admin" || u.role == "editor")
            .unwrap_or(false)
    }

    /// Check if a user can edit/delete posts (admin or editor).
    pub fn can_edit_posts(&self, email: &str) -> bool {
        self.can_create_posts(email)
    }

    /// List all users.
    pub fn list(&self) -> Vec<&User> {
        self.users.values().collect()
    }

    /// Set a user's role. Valid roles: "admin", "editor", "viewer".
    pub fn set_role(&mut self, email: &str, role: &str) -> Option<User> {
        let valid_roles = ["admin", "editor", "viewer"];
        if !valid_roles.contains(&role) {
            return None;
        }
        let user = self.users.get_mut(email)?;
        user.role = role.to_string();
        let updated = user.clone();
        self.save();
        Some(updated)
    }

    /// Remove a user by email.
    pub fn remove(&mut self, email: &str) -> bool {
        let removed = self.users.remove(email).is_some();
        if removed {
            self.save();
        }
        removed
    }
}
