use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use crate::{load_from_storage, save_to_storage, POSTS_STORAGE_KEY};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Post {
    pub id: String,
    pub title: String,
    pub content: String,
    pub author_email: String,
    pub created_at: f64,
    pub updated_at: f64,
    pub published: bool,
}

#[derive(Serialize, Deserialize, Default)]
pub struct PostManager {
    posts: HashMap<String, Post>,
    next_id: u64,
}

impl PostManager {
    /// Load from localStorage or start fresh.
    pub fn load() -> Self {
        if let Some(data) = load_from_storage(POSTS_STORAGE_KEY) {
            serde_json::from_str(&data).unwrap_or_default()
        } else {
            Self::default()
        }
    }

    /// Persist current state to localStorage.
    fn save(&self) {
        if let Ok(json) = serde_json::to_string(self) {
            let _ = save_to_storage(POSTS_STORAGE_KEY, &json);
        }
    }

    /// Generate a unique post ID.
    fn gen_id(&mut self) -> String {
        self.next_id += 1;
        format!("post_{}", self.next_id)
    }

    /// Get current timestamp via js_sys.
    fn now() -> f64 {
        js_sys::Date::now()
    }

    /// Create a new post.
    pub fn create(&mut self, title: &str, content: &str, author_email: &str) -> Post {
        let id = self.gen_id();
        let now = Self::now();
        let post = Post {
            id: id.clone(),
            title: title.to_string(),
            content: content.to_string(),
            author_email: author_email.to_string(),
            created_at: now,
            updated_at: now,
            published: true,
        };
        self.posts.insert(id, post.clone());
        self.save();
        post
    }

    /// Update an existing post.
    pub fn update(&mut self, id: &str, title: &str, content: &str) -> Option<Post> {
        let post = self.posts.get_mut(id)?;
        post.title = title.to_string();
        post.content = content.to_string();
        post.updated_at = Self::now();
        let updated = post.clone();
        self.save();
        Some(updated)
    }

    /// Delete a post by ID.
    pub fn delete(&mut self, id: &str) -> bool {
        let removed = self.posts.remove(id).is_some();
        if removed {
            self.save();
        }
        removed
    }

    /// Get a post by ID.
    pub fn get(&self, id: &str) -> Option<&Post> {
        self.posts.get(id)
    }

    /// List all posts, sorted newest first.
    pub fn list(&self) -> Vec<&Post> {
        let mut posts: Vec<&Post> = self.posts.values().collect();
        posts.sort_by(|a, b| b.created_at.partial_cmp(&a.created_at).unwrap());
        posts
    }
}
