FROM node:23.7-bullseye-slim

COPY ./src/server/ /app/server/
COPY ./src/public/ /app/public/
COPY ./src/package.json /app/
COPY ./entrypoint.sh /app/


WORKDIR /app

CMD ["sh", "entrypoint.sh"]

EXPOSE 3000