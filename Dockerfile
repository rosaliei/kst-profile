# ── Stage: Serve ────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy site assets
COPY index.html        /usr/share/nginx/html/index.html

# Use a lean custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
