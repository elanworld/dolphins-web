FROM nginx
COPY nginx.conf /etc/nginx/conf.d/
COPY ./dist/ /usr/share/nginx/html/
EXPOSE 8000
