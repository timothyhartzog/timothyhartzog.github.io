# ============================================================
# Dockerfile — hartzog.dev (timothyhartzog.github.io)
# Pure static HTML/CSS/JS — no build step needed
# ============================================================
FROM nginx:1.27-alpine

# Copy all static files into nginx's serve root
COPY . /usr/share/nginx/html

# Drop the default nginx config and use our own
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run requires port 8080 (not 80)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
