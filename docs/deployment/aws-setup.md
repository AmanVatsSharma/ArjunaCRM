# AWS Deployment Setup Guide

This guide walks you through setting up ArjunaCRM on AWS infrastructure.

## Prerequisites

- AWS account with appropriate permissions
- AWS CLI configured with credentials
- Domain name configured in Route53 (or another DNS provider)
- SSL certificates (can be provisioned via ACM)

## Infrastructure Overview

ArjunaCRM requires the following AWS services:

- **ECS/Fargate** - Container hosting for backend API and website
- **RDS PostgreSQL** - Database
- **ElastiCache Redis** - Caching and session storage
- **S3** - Static file hosting for frontend and docs
- **CloudFront** - CDN for static assets
- **Route53** - DNS management
- **ACM** - SSL certificates
- **ECR** - Container registry

## Domain Structure

- `www.vedpragya.com` - Marketing website
- `app.vedpragya.com` - Main CRM application
- `api.vedpragya.com` - Backend API
- `docs.vedpragya.com` - Documentation site

## Step 1: Set Up RDS PostgreSQL

```bash
aws rds create-db-instance \
  --db-instance-identifier arjunacrm-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16 \
  --master-username postgres \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name arjunacrm-db-subnet-group \
  --backup-retention-period 7 \
  --storage-encrypted
```

## Step 2: Set Up ElastiCache Redis

```bash
aws elasticache create-cache-cluster \
  --cache-cluster-id arjunacrm-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --vpc-security-group-ids sg-xxxxx \
  --subnet-group-name arjunacrm-redis-subnet-group
```

## Step 3: Create S3 Buckets

```bash
# Frontend bucket
aws s3 mb s3://arjunacrm-app --region us-east-1
aws s3 website s3://arjunacrm-app --index-document index.html --error-document index.html

# Docs bucket
aws s3 mb s3://arjunacrm-docs --region us-east-1
aws s3 website s3://arjunacrm-docs --index-document index.html --error-document index.html
```

## Step 4: Set Up CloudFront Distributions

Create CloudFront distributions for frontend and docs buckets:

1. Go to CloudFront console
2. Create distribution for each bucket
3. Set origin domain to S3 bucket
4. Configure SSL certificate from ACM
5. Set default root object to `index.html`
6. Configure error pages (404 → index.html for SPA routing)

## Step 5: Set Up ECR Repository

```bash
aws ecr create-repository --repository-name arjunacrm/arjuna --region us-east-1
aws ecr create-repository --repository-name arjunacrm/arjuna-website --region us-east-1
```

## Step 6: Set Up ECS Cluster

```bash
aws ecs create-cluster --cluster-name arjunacrm-cluster --region us-east-1
```

## Step 7: Configure Route53 DNS

Create A records (or CNAME) pointing to:

- `www.vedpragya.com` → ALB / ECS service for website
- `app.vedpragya.com` → CloudFront distribution for frontend
- `api.vedpragya.com` → Application Load Balancer (if using ALB) or ECS service
- `docs.vedpragya.com` → CloudFront distribution for docs

## Step 8: Set Up GitHub Secrets

Configure the following secrets in your GitHub repository:

### Required Secrets

- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `DATABASE_URL` - PostgreSQL connection string (production)
- `REDIS_URL` - Redis connection string (production)
- `APP_SECRET` - Application secret key (generate a random string)

### ECS Deployment Secrets

- `ECS_SUBNETS` - Comma-separated subnet IDs for ECS tasks (e.g., `subnet-abc123,subnet-def456`)
- `ECS_SECURITY_GROUPS` - Comma-separated security group IDs (e.g., `sg-abc123,sg-def456`)

**Note**: These are required for database migrations and ECS task execution. Get subnet IDs from your VPC and security group IDs from your ECS service configuration.

## Step 9: Set Up GitHub Variables

Configure these repository variables in GitHub Actions:

- `AWS_REGION` (example: `us-east-1`)
- `ECR_REPOSITORY_BACKEND`, `ECS_CLUSTER_BACKEND`, `ECS_SERVICE_BACKEND`, `ECS_TASK_DEFINITION_BACKEND`
- `ECR_REPOSITORY_WEBSITE`, `ECS_CLUSTER_WEBSITE`, `ECS_SERVICE_WEBSITE`, `ECS_TASK_DEFINITION_WEBSITE`
- `S3_BUCKET_FRONTEND`, `CLOUDFRONT_DISTRIBUTION_ID_FRONTEND`
- `S3_BUCKET_DOCS`, `CLOUDFRONT_DISTRIBUTION_ID_DOCS`
- `BACKEND_PUBLIC_URL`, `FRONTEND_PUBLIC_URL`, `DOCS_PUBLIC_URL`, `WEBSITE_PUBLIC_URL`
- `FRONTEND_API_BASE_URL`

## Step 10: Configure GitHub Secrets

Before deploying, ensure all required secrets are configured in GitHub:

1. Go to your repository → Settings → Secrets and variables → Actions
2. Add all secrets listed in Step 8
3. Add the repository variables listed in Step 9
4. Verify ECS subnet and security group IDs match your infrastructure

## Step 11: Deploy

Once infrastructure is set up and secrets are configured, deployments will happen automatically via GitHub Actions when you push to `main` branch or create a release tag.

**First Deployment:**

- Push to `main` branch or manually trigger workflows
- Monitor GitHub Actions for deployment status
- Check CloudWatch logs for application startup
- Verify all services are accessible via their domains

## Monitoring

Set up CloudWatch for:

- Application logs
- Database monitoring
- Redis monitoring
- ECS service metrics

## Backup Strategy

- RDS automated backups (configure retention period)
- S3 versioning for static assets
- Regular database snapshots

## Security Best Practices

- Use IAM roles instead of access keys where possible
- Enable encryption at rest for RDS and S3
- Use security groups to restrict access
- Enable CloudFront signed URLs for sensitive content
- Regularly rotate secrets and credentials
