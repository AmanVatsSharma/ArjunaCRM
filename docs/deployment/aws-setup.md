# AWS Deployment Setup Guide

This guide walks you through setting up ArjunaCRM on AWS infrastructure.

## Prerequisites

- AWS account with appropriate permissions
- AWS CLI configured with credentials
- Domain name configured in Route53 (or another DNS provider)
- SSL certificates (can be provisioned via ACM)

## Infrastructure Overview

ArjunaCRM requires the following AWS services:

- **ECS/Fargate** - Container hosting for backend API
- **RDS PostgreSQL** - Database
- **ElastiCache Redis** - Caching and session storage
- **S3** - Static file hosting for frontend, docs, and website
- **CloudFront** - CDN for static assets
- **Route53** - DNS management
- **ACM** - SSL certificates
- **ECR** - Container registry

## Domain Structure

- `www.arjunacrm.com` - Marketing website
- `app.arjunacrm.com` - Main CRM application
- `api.arjunacrm.com` - Backend API
- `docs.arjunacrm.com` - Documentation site

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

# Website bucket
aws s3 mb s3://arjunacrm-website --region us-east-1
aws s3 website s3://arjunacrm-website --index-document index.html --error-document index.html
```

## Step 4: Set Up CloudFront Distributions

Create CloudFront distributions for each S3 bucket:

1. Go to CloudFront console
2. Create distribution for each bucket
3. Set origin domain to S3 bucket
4. Configure SSL certificate from ACM
5. Set default root object to `index.html`
6. Configure error pages (404 → index.html for SPA routing)

## Step 5: Set Up ECR Repository

```bash
aws ecr create-repository --repository-name arjunacrm/arjuna --region us-east-1
```

## Step 6: Set Up ECS Cluster

```bash
aws ecs create-cluster --cluster-name arjunacrm-cluster --region us-east-1
```

## Step 7: Configure Route53 DNS

Create A records (or CNAME) pointing to:
- `www.arjunacrm.com` → CloudFront distribution for website
- `app.arjunacrm.com` → CloudFront distribution for frontend
- `api.arjunacrm.com` → Application Load Balancer (if using ALB) or ECS service
- `docs.arjunacrm.com` → CloudFront distribution for docs

## Step 8: Set Up GitHub Secrets

Configure the following secrets in your GitHub repository:

- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `APP_SECRET` - Application secret key

## Step 9: Deploy

Once infrastructure is set up, deployments will happen automatically via GitHub Actions when you push to `main` branch or create a release tag.

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

