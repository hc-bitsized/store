FROM public.ecr.aws/bitnami/node:latest

RUN mkdir /usr/share/backend

WORKDIR /usr/share/backend
COPY . .
RUN npm ci --production --unsafe-perm

EXPOSE 3000

CMD ["sh", "-c", "node server.js"]
