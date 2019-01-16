FROM nginx:latest
# alpine ?
COPY ./build/ /usr/share/nginx/html
