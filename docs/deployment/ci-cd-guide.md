# CI/CD Pipeline Guide

This document describes the CI/CD pipeline setup for ArjunaCRM.

## Overview

ArjunaCRM uses GitHub Actions for continuous integration and deployment. The pipeline includes:

- **CI Pipeline** - Runs on every push/PR (linting, type checking, tests, builds)
- **Deployment Pipelines** - Run on main branch pushes and version tags
- **Release Pipeline** - Creates GitHub releases and triggers deployments

## Workflows

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every push and pull request:

1. **Lint and Type Check** - Available via manual dispatch for focused QA runs
2. **Test** - Available via manual dispatch for focused QA runs
3. **Build** - Builds all packages to verify compilation

### Backend Deployment (`.github/workflows/deploy-backend.yml`)

Deploys the backend API to AWS ECS:

1. Builds Docker image
2. Pushes to ECR
3. Updates ECS task definition
4. Deploys to ECS service
5. Runs database migrations as a dedicated ECS task and fails deployment if the task exits non-zero

When deployment is triggered from a `v*.*.*` tag, the workflow also injects
that tag as `APP_VERSION` build-arg into the backend image.

**Triggers:**

- Push to `main` branch
- Version tags (`v*.*.*`)
- Manual workflow dispatch

### Frontend Deployment (`.github/workflows/deploy-frontend.yml`)

Deploys the frontend application to S3 + CloudFront:

1. Builds React application
2. Syncs to S3 bucket
3. Invalidates CloudFront cache

**Triggers:**

- Push to `main` branch
- Version tags (`v*.*.*`)
- Manual workflow dispatch

### Documentation Deployment (`.github/workflows/deploy-docs.yml`)

Validates documentation content for Mintlify Cloud deployment:

1. Installs workspace dependencies
2. Lints core MDX documentation routes
3. Reports validation result (Mintlify Cloud handles publishing)

**Triggers:**

- Manual workflow dispatch

### Website Deployment (`.github/workflows/deploy-website.yml`)

Deploys marketing website to AWS ECS:

1. Builds Docker image from `packages/arjuna-docker/arjuna-website-docker/Dockerfile`
2. Pushes image to ECR
3. Updates ECS task definition
4. Deploys to ECS service

**Triggers:**

- Manual workflow dispatch

### Release Workflow (`.github/workflows/release.yml`)

Creates GitHub releases and triggers all deployments:

1. Generates changelog from git commits
2. Creates GitHub release
3. Triggers all deployment workflows

**Triggers:**

- Version tags (`v*.*.*`)

## Required GitHub Secrets

Configure these secrets in your repository settings:

### AWS Credentials

- `AWS_ACCESS_KEY_ID` - AWS access key with deployment permissions
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

### Application Secrets

- `DATABASE_URL` - PostgreSQL connection string (production)
- `REDIS_URL` - Redis connection string (production)
- `APP_SECRET` - Application secret key

### Environment-Specific

- `ECS_SUBNETS` - ECS subnet IDs as comma-separated string or JSON array (e.g., `subnet-xxx,subnet-yyy` or `["subnet-xxx","subnet-yyy"]`)
- `ECS_SECURITY_GROUPS` - ECS security groups as comma-separated string or JSON array (e.g., `sg-xxx,sg-yyy` or `["sg-xxx","sg-yyy"]`)

### Repository Variables (GitHub Actions → Variables)

- `AWS_REGION` - AWS region (default: us-east-1)
- `BACKEND_PUBLIC_URL` - Public backend URL (for deployment notifications)
- `ECR_REPOSITORY_BACKEND` - ECR repository for backend image
- `ECS_CLUSTER_BACKEND` - ECS cluster hosting backend service
- `ECS_SERVICE_BACKEND` - ECS service for backend
- `ECS_TASK_DEFINITION_BACKEND` - ECS task definition name for backend
- `ECS_CONTAINER_NAME_BACKEND` - backend container name inside ECS task definition
- `FRONTEND_API_BASE_URL` - API base URL injected into frontend build
- `FRONTEND_PUBLIC_URL` - Public frontend URL
- `S3_BUCKET_FRONTEND` - S3 bucket used for frontend deployment
- `CLOUDFRONT_DISTRIBUTION_ID_FRONTEND` - CloudFront distribution for frontend
- `DOCS_PUBLIC_URL` - Public docs URL
- `WEBSITE_PUBLIC_URL` - Public website URL
- `ECR_REPOSITORY_WEBSITE` - ECR repository name for website container
- `ECS_CLUSTER_WEBSITE` - ECS cluster hosting website service
- `ECS_SERVICE_WEBSITE` - ECS service for website
- `ECS_TASK_DEFINITION_WEBSITE` - ECS task definition for website
- `ECS_CONTAINER_NAME_WEBSITE` - website container name inside ECS task definition

## Deployment Process

### Automatic Deployment

1. Push code to `main` branch
2. CI pipeline runs (lint, test, build)
3. If CI passes, deployment workflows trigger automatically
4. Each service deploys independently

### Manual Deployment

1. Go to Actions tab in GitHub
2. Select the deployment workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

### Release Deployment

1. Create and push a version tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. Release workflow creates GitHub release
3. All deployment workflows trigger automatically

## Monitoring Deployments

- Check GitHub Actions tab for workflow status
- Monitor CloudWatch logs for application logs
- Check ECS service events for deployment status
- Verify CloudFront cache invalidation

## Rollback Procedure

### Backend Rollback

1. Find previous working task definition in ECS
2. Update service to use previous task definition:
   ```bash
   aws ecs update-service \
     --cluster arjunacrm-cluster \
     --service arjunacrm-server \
     --task-definition arjunacrm-server-task:REVISION
   ```

### Frontend Rollback

1. Find previous build in S3 version history
2. Restore previous version:
   ```bash
   aws s3 cp s3://bucket-name/previous-version/ s3://bucket-name/ --recursive
   ```
3. Invalidate CloudFront cache

### Documentation Rollback

Documentation is hosted by Mintlify Cloud. Rollback from the Mintlify
dashboard by restoring a previous synced revision or reverting the source commit
and re-syncing.

### Website Rollback

1. Find previous healthy task definition in ECS
2. Update the website service to previous task definition:
   ```bash
   aws ecs update-service \
     --cluster arjunacrm-cluster \
     --service arjunacrm-website \
     --task-definition arjunacrm-website-task:REVISION
   ```

## Troubleshooting

### Build Failures

- Check GitHub Actions logs for specific errors
- Verify all dependencies are correctly specified
- Ensure Node.js version matches (24.x)
- `CI Utils` uses `pull_request_target`; workflow behavior may reflect default
  branch config until changes are merged into `main`.

### Deployment Failures

- Check AWS credentials and permissions
- Verify infrastructure exists (ECS cluster, S3 buckets, etc.)
- Check CloudWatch logs for application errors
- Verify environment variables are set correctly

### Database Migration Failures

- Check database connection string
- Verify database user has migration permissions
- Check migration logs in CloudWatch
- Verify `ECS_SUBNETS` and `ECS_SECURITY_GROUPS` secrets are configured correctly
- Ensure ECS task has network access to RDS and Redis

## Build Output Paths

Each service has a specific build/deployment path:

- **Frontend** (`arjuna-front`): `packages/arjuna-front/build/`
- **Documentation** (`arjuna-docs`): lint-only validation in workflow; published by Mintlify Cloud
- **Website** (`arjuna-website`): Docker image built from `packages/arjuna-docker/arjuna-website-docker/Dockerfile`
- **Backend** (`arjuna-server`): Docker image built from `packages/arjuna-docker/arjuna/Dockerfile`
