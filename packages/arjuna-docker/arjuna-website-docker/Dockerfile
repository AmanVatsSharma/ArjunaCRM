FROM node:24-alpine AS arjuna-website-build


WORKDIR /app

COPY ./package.json ./package-lock.json /app/
COPY ./tools/eslint-rules /app/tools/eslint-rules
COPY ./packages/arjuna-ui/package.json /app/packages/arjuna-ui/
COPY ./packages/arjuna-shared/package.json /app/packages/arjuna-shared/
COPY ./packages/arjuna-website/package.json /app/packages/arjuna-website/package.json

RUN npm ci

ENV KEYSTATIC_GITHUB_CLIENT_ID="<fake build value>"
ENV KEYSTATIC_GITHUB_CLIENT_SECRET="<fake build value>"
ENV KEYSTATIC_SECRET="<fake build value>"
ENV NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG="<fake build value>"

COPY ./packages/arjuna-ui /app/packages/arjuna-ui
COPY ./packages/arjuna-website /app/packages/arjuna-website
RUN npx nx build arjuna-website

FROM node:24-alpine AS arjuna-website

WORKDIR /app/packages/arjuna-website

COPY --from=arjuna-website-build /app /app

WORKDIR /app/packages/arjuna-website

LABEL org.opencontainers.image.source=https://github.com/vedpragyabharat/arjuna
LABEL org.opencontainers.image.description="This image provides a consistent and reproducible environment for the website."

RUN chown -R 1000 /app

# Use non root user with uid 1000
USER 1000

CMD ["/bin/sh", "-c", "npx nx start"]
