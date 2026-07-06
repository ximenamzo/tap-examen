FROM node:20-bullseye

ARG UID=1000
ARG GID=1000
RUN userdel -r node 2>/dev/null || true \
    && groupdel node 2>/dev/null || true \
    && groupadd -g ${GID} devgroup \
    && useradd -u ${UID} -g devgroup -m -s /bin/bash devuser

RUN npm install -g @angular/cli@19

WORKDIR /app

USER devuser

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]