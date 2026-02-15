# ArjunaCRM Deployment Guide

## Overview

This document provides a quick reference for deploying ArjunaCRM v1.0 to production.

## Quick Start

### 1. Prerequisites

- Node.js 24.x
- Yarn 4.x (via Corepack)
- AWS account with appropriate permissions
- Domain name configured

### 2. Local Development Setup

```bash
# Install dependencies
yarn install --immutable

# Copy environment files
cp packages/arjuna-server/.env.example packages/arjuna-server/.env
cp packages/arjuna-front/.env.example packages/arjuna-front/.env

# Start development servers
yarn start
```

### 3. AWS Infrastructure Setup

Follow the detailed guide in [docs/deployment/aws-setup.md](docs/deployment/aws-setup.md) to set up:

- RDS PostgreSQL database
- ElastiCache Redis
- ECS cluster for backend and website
- S3 bucket + CloudFront for static frontend assets
- Mintlify Cloud domain for docs hosting
- Route53 DNS records

### 4. Configure GitHub Secrets

Set up the following secrets in your GitHub repository:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DATABASE_URL` (production)
- `REDIS_URL` (production)
- `APP_SECRET` (generate a random string)
- `ECS_SUBNETS` (comma-separated private subnet IDs)
- `ECS_SECURITY_GROUPS` (comma-separated security group IDs)

Also configure repository variables for deployment routing:

- `AWS_REGION`
- `ECR_REPOSITORY_BACKEND`, `ECS_CLUSTER_BACKEND`, `ECS_SERVICE_BACKEND`, `ECS_TASK_DEFINITION_BACKEND`
- `ECR_REPOSITORY_WEBSITE`, `ECS_CLUSTER_WEBSITE`, `ECS_SERVICE_WEBSITE`, `ECS_TASK_DEFINITION_WEBSITE`
- `S3_BUCKET_FRONTEND`, `CLOUDFRONT_DISTRIBUTION_ID_FRONTEND`
- `BACKEND_PUBLIC_URL`, `FRONTEND_PUBLIC_URL`, `DOCS_PUBLIC_URL`, `WEBSITE_PUBLIC_URL`
- `FRONTEND_API_BASE_URL`

### 5. Deploy

Deployments happen automatically when you:

- Push to `main` branch (triggers all deployments)
- Create a version tag `v*.*.*` (creates release and deploys)

Or manually trigger deployments from GitHub Actions.

## Domain Structure

- `www.vedpragya.com` - Marketing website
- `app.vedpragya.com` - Main CRM application
- `api.vedpragya.com` - Backend API
- `docs.vedpragya.com` - Documentation site

## Key Commands

```bash
# Development
yarn start                    # Start all services
yarn nx run-many --target=build --projects=arjuna-front,arjuna-server,arjuna-ui,arjuna-shared,arjuna-emails,arjuna-website --parallel=3
yarn nx run-many --target=test --projects=arjuna-front,arjuna-server,arjuna-ui,arjuna-shared,arjuna-emails --parallel=3
yarn nx run-many --target=lint --projects=arjuna-front,arjuna-server,arjuna-ui,arjuna-shared,arjuna-emails,arjuna-website --parallel=3

# Backend
npx nx start arjuna-server   # Start backend server
npx nx run arjuna-server:worker  # Start worker

# Frontend
npx nx start arjuna-front    # Start frontend dev server

# Database
npx nx database:reset arjuna-server  # Reset database
npx nx run arjuna-server:database:migrate:prod  # Run migrations
```

## Documentation

- [AWS Setup Guide](docs/deployment/aws-setup.md) - Detailed AWS infrastructure setup
- [CI/CD Guide](docs/deployment/ci-cd-guide.md) - GitHub Actions pipeline documentation
- [Environment Variables](docs/deployment/environment-variables.md) - Complete environment variable reference
- [Deployment and Rollback Runbook](docs/deployment/runbook-deployment-and-rollback.md) - Release, smoke checks, and rollback steps
- [Backup and Incident Runbook](docs/deployment/runbook-backup-restore-and-incident.md) - Backup policy, restore flow, and incident response
- [Launch Readiness Checklist](docs/deployment/launch-readiness-checklist.md) - Final go/no-go validation checklist

## Troubleshooting

### Build Failures

- Ensure Node.js version is 24.x
- Clear node_modules and reinstall: `rm -rf node_modules && yarn install --immutable`
- Check for TypeScript errors: `yarn nx run-many --target=typecheck --projects=arjuna-front,arjuna-server,arjuna-ui,arjuna-shared,arjuna-emails,arjuna-website --parallel=3`

### Deployment Failures

- Verify AWS credentials in GitHub Secrets
- Check CloudWatch logs for application errors
- Verify infrastructure exists (ECS cluster, S3 buckets, etc.)
- Check GitHub Actions logs for specific errors

### Database Issues

- Verify database connection string format
- Check security groups allow connections
- Verify database user has required permissions

## Support

For issues and questions:

- Check documentation in `docs/` directory
- Review GitHub Actions logs
- Check CloudWatch logs for runtime errors

## Next Steps

1. Set up monitoring and alerting
2. Configure backup strategy
3. Set up staging environment
4. Review security settings
5. Configure custom domain SSL certificates
