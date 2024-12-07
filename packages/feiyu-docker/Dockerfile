FROM lipanski/docker-static-website:latest

COPY dist .

CMD ["/busybox-httpd", "-f", "-v", "-p", "3000"]
