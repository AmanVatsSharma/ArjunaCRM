# GitHub Secrets Setup Guide

This guide lists all required GitHub secrets for ArjunaCRM CI/CD pipelines.

## Required Secrets

Configure these in: **Repository Settings → Secrets and variables → Actions**

### AWS Credentials

| Secret Name | Description | Example |
|------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS access key with deployment permissions | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |

**Permissions Required:**
- ECR: Push/pull images
- ECS: Update services, run tasks
- S3: Read/write to buckets
- CloudFront: Create invalidations
- Route53: Update DNS records (if automating DNS)

### Application Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string (production) | `postgres://user:pass@host:5432/dbname` |
| `REDIS_URL` | Redis connection string (production) | `redis://host:6379` |
| `APP_SECRET` | Application secret key (generate random string) | `your-random-secret-key-here` |

**Generate APP_SECRET:**
```bash
openssl rand -base64 32
```

### ECS Deployment Secrets

| Secret Name | Description | Format | Example |
|------------|-------------|--------|---------|
| `ECS_SUBNETS` | Comma-separated subnet IDs for ECS tasks | `subnet-id1,subnet-id2` | `subnet-abc123,subnet-def456` |
| `ECS_SECURITY_GROUPS` | Comma-separated security group IDs | `sg-id1,sg-id2` | `sg-abc123,sg-def456` |

**How to Find These Values:**

1. **Subnets**:
   - Go to VPC → Subnets
   - Select subnets in your ECS service's VPC
   - Copy subnet IDs (format: `subnet-xxxxx`)

2. **Security Groups**:
   - Go to EC2 → Security Groups
   - Find security groups used by your ECS service
   - Copy security group IDs (format: `sg-xxxxx`)

**Note**: These are required for database migrations and ECS task execution. Ensure the security groups allow:
- Outbound internet access (for pulling images)
- Access to RDS (if in same VPC)
- Access to ElastiCache Redis (if in same VPC)

## Optional Secrets

These can be set as environment variables in workflow files or as secrets:

| Secret Name | Description | Default |
|------------|-------------|---------|
| `AWS_REGION` | AWS region | `us-east-1` |
| `ECR_REPOSITORY` | ECR repository name | `arjunacrm/arjuna` |
| `ECS_CLUSTER` | ECS cluster name | `arjunacrm-cluster` |
| `ECS_SERVICE` | ECS service name | `arjunacrm-server` |
| `ECS_TASK_DEFINITION` | ECS task definition | `arjunacrm-server-task` |

## Setting Up Secrets

### Via GitHub Web Interface

1. Go to your repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter name and value
5. Click **Add secret**

### Via GitHub CLI

```bash
# Set AWS credentials
gh secret set AWS_ACCESS_KEY_ID --body "your-access-key"
gh secret set AWS_SECRET_ACCESS_KEY --body "your-secret-key"

# Set application secrets
gh secret set DATABASE_URL --body "postgres://..."
gh secret set REDIS_URL --body "redis://..."
gh secret set APP_SECRET --body "$(openssl rand -base64 32)"

# Set ECS deployment secrets
gh secret set ECS_SUBNETS --body "subnet-abc123,subnet-def456"
gh secret set ECS_SECURITY_GROUPS --body "sg-abc123,sg-def456"
```

## Verification

After setting secrets, verify they're configured:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Verify all required secrets are listed
3. Test by manually triggering a deployment workflow
4. Check workflow logs for any missing secret errors

## Security Best Practices

1. **Rotate Secrets Regularly**: Update AWS keys and APP_SECRET periodically
2. **Use Least Privilege**: Grant only necessary permissions to AWS IAM user
3. **Don't Commit Secrets**: Never commit secrets to repository
4. **Use Environment-Specific Secrets**: Different secrets for staging/production
5. **Monitor Access**: Review GitHub audit logs for secret access

## Troubleshooting

### "Secret not found" errors

- Verify secret name matches exactly (case-sensitive)
- Check you're setting secrets in the correct repository
- Ensure you have admin access to the repository

### AWS Permission Errors

- Verify IAM user has required permissions
- Check AWS credentials are correct
- Ensure security groups allow necessary traffic

### ECS Task Failures

- Verify `ECS_SUBNETS` and `ECS_SECURITY_GROUPS` are correct
- Check security groups allow outbound internet access
- Ensure subnets are in the same VPC as ECS service


