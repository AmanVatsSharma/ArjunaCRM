# Base image for common dependencies
FROM node:24-alpine AS common-deps

WORKDIR /app

# Copy only the necessary files for dependency resolution
COPY ./package.json ./yarn.lock ./tsconfig.base.json ./nx.json /app/
COPY ./.yarnrc.yml /app/.yarnrc.yml
COPY ./.yarn/releases /app/.yarn/releases
COPY ./.yarn/patches /app/.yarn/patches

COPY ./.prettierrc /app/
COPY ./packages/arjuna-emails/package.json /app/packages/arjuna-emails/
COPY ./packages/arjuna-server/package.json /app/packages/arjuna-server/
COPY ./packages/arjuna-server/patches /app/packages/arjuna-server/patches
COPY ./packages/arjuna-ui/package.json /app/packages/arjuna-ui/
COPY ./packages/arjuna-shared/package.json /app/packages/arjuna-shared/
COPY ./packages/arjuna-front/package.json /app/packages/arjuna-front/

# Install all dependencies
RUN corepack enable && yarn install && npx nx reset


# Build the back
FROM common-deps AS arjuna-server-build

# Copy sourcecode after installing dependences to accelerate subsequents builds
COPY ./packages/arjuna-emails /app/packages/arjuna-emails
COPY ./packages/arjuna-shared /app/packages/arjuna-shared
COPY ./packages/arjuna-server /app/packages/arjuna-server

RUN npx nx run arjuna-server:build

# Build the front
FROM common-deps AS arjuna-front-build

ARG REACT_APP_SERVER_BASE_URL

COPY ./packages/arjuna-front /app/packages/arjuna-front
COPY ./packages/arjuna-ui /app/packages/arjuna-ui
COPY ./packages/arjuna-shared /app/packages/arjuna-shared
RUN npx nx build arjuna-front


# Final stage: Run the application
FROM node:24-alpine AS arjuna

# Used to run healthcheck in docker
RUN apk add --no-cache curl jq

RUN npm install -g tsx

RUN apk add --no-cache postgresql-client

COPY ./packages/arjuna-docker/arjuna/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
WORKDIR /app/packages/arjuna-server

ARG REACT_APP_SERVER_BASE_URL
ENV REACT_APP_SERVER_BASE_URL=$REACT_APP_SERVER_BASE_URL

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

# Copy built applications from previous stages
COPY --chown=1000 --from=arjuna-server-build /app /app
COPY --chown=1000 --from=arjuna-server-build /app/packages/arjuna-server /app/packages/arjuna-server
COPY --chown=1000 --from=arjuna-front-build /app/packages/arjuna-front/build /app/packages/arjuna-server/dist/front

# Set metadata and labels
LABEL org.opencontainers.image.source=https://github.com/vedpragyabharat/arjuna
LABEL org.opencontainers.image.description="This image provides a consistent and reproducible environment for the backend and frontend, ensuring it deploys faster and runs the same way regardless of the deployment environment."

RUN mkdir -p /app/.local-storage /app/packages/arjuna-server/.local-storage && \
    chown -R 1000:1000 /app

# Use non root user with uid 1000
USER 1000

CMD ["node", "dist/main"]
ENTRYPOINT ["/app/entrypoint.sh"]
