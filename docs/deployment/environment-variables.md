# Environment Variables Reference

This document lists all environment variables used across ArjunaCRM services.

## Backend (arjuna-server)

### Server Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `production` | Node environment (development, production, test) |
| `NODE_PORT` | No | `3000` | Port for the Node.js server |
| `SERVER_URL` | Yes | - | Base URL for the server (e.g., https://api.arjunacrm.com) |
| `PUBLIC_DOMAIN_URL` | No | - | Public domain URL |
| `CORS_ALLOWED_ORIGINS` | No | - | Comma-separated list of extra allowed CORS origins |
| `APP_SECRET` | Yes | - | Secret key for the application (generate random string) |

### Database Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PG_DATABASE_URL` | Yes | - | PostgreSQL connection string |

### Redis Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_URL` | Yes | - | Redis connection string |
| `REDIS_QUEUE_URL` | No | - | Separate Redis for queues (advanced) |

### Storage Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STORAGE_TYPE` | Yes | `local` | Storage type: `local` or `s3` |
| `STORAGE_S3_REGION` | Conditional | - | AWS region for S3 (if STORAGE_TYPE=s3) |
| `STORAGE_S3_NAME` | Conditional | - | S3 bucket name (if STORAGE_TYPE=s3) |
| `STORAGE_S3_ENDPOINT` | Conditional | - | S3 endpoint (if STORAGE_TYPE=s3) |
| `AWS_ACCESS_KEY_ID` | Conditional | - | AWS access key (if using S3) |
| `AWS_SECRET_ACCESS_KEY` | Conditional | - | AWS secret key (if using S3) |

### Email Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMAIL_DRIVER` | Yes | `smtp` | Email driver: `smtp` or `ses` |
| `EMAIL_FROM_ADDRESS` | Yes | - | From email address |
| `EMAIL_FROM_NAME` | Yes | - | From name |
| `EMAIL_SYSTEM_ADDRESS` | Yes | - | System email address |
| `EMAIL_SMTP_HOST` | Conditional | - | SMTP host (if EMAIL_DRIVER=smtp) |
| `EMAIL_SMTP_PORT` | Conditional | - | SMTP port (if EMAIL_DRIVER=smtp) |
| `EMAIL_SMTP_USER` | Conditional | - | SMTP username (if EMAIL_DRIVER=smtp) |
| `EMAIL_SMTP_PASSWORD` | Conditional | - | SMTP password (if EMAIL_DRIVER=smtp) |
| `AWS_SES_REGION` | Conditional | - | AWS SES region (if EMAIL_DRIVER=ses) |

### Authentication Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AUTH_PASSWORD_ENABLED` | No | `true` | Enable password authentication |
| `IS_EMAIL_VERIFICATION_REQUIRED` | No | `false` | Require email verification |
| `SIGN_IN_PREFILLED` | No | `false` | Prefill login form (development) |

#### Google Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AUTH_GOOGLE_ENABLED` | No | `false` | Enable Google SSO |
| `AUTH_GOOGLE_CLIENT_ID` | Conditional | - | Google OAuth client ID |
| `AUTH_GOOGLE_CLIENT_SECRET` | Conditional | - | Google OAuth client secret |
| `AUTH_GOOGLE_CALLBACK_URL` | Conditional | - | Google OAuth callback URL |
| `AUTH_GOOGLE_APIS_CALLBACK_URL` | Conditional | - | Google APIs callback URL |

#### Microsoft Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AUTH_MICROSOFT_ENABLED` | No | `false` | Enable Microsoft SSO |
| `AUTH_MICROSOFT_CLIENT_ID` | Conditional | - | Microsoft OAuth client ID |
| `AUTH_MICROSOFT_CLIENT_SECRET` | Conditional | - | Microsoft OAuth client secret |
| `AUTH_MICROSOFT_CALLBACK_URL` | Conditional | - | Microsoft OAuth callback URL |
| `AUTH_MICROSOFT_APIS_CALLBACK_URL` | Conditional | - | Microsoft APIs callback URL |

### Integration Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CALENDAR_PROVIDER_GOOGLE_ENABLED` | No | `false` | Enable Google Calendar |
| `MESSAGING_PROVIDER_GMAIL_ENABLED` | No | `false` | Enable Gmail messaging |
| `CALENDAR_PROVIDER_MICROSOFT_ENABLED` | No | `false` | Enable Microsoft Calendar |
| `MESSAGING_PROVIDER_MICROSOFT_ENABLED` | No | `false` | Enable Microsoft messaging |
| `IS_IMAP_SMTP_CALDAV_ENABLED` | No | `false` | Enable IMAP/SMTP/CalDAV |

### Logging Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LOG_LEVEL` | No | `log` | Log level (error, warn, log, debug, verbose) |
| `LOG_DRIVER` | No | `console` | Log driver (console, file, cloudwatch) |

### Feature Flags

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DISABLE_DB_MIGRATIONS` | No | `false` | Disable automatic database migrations |
| `DISABLE_CRON_JOBS_REGISTRATION` | No | `false` | Disable cron job registration |

## Frontend (arjuna-front)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REACT_APP_SERVER_BASE_URL` | Yes | - | Backend API URL |
| `REACT_APP_PORT` | No | `3001` | Development server port |
| `VITE_HOST` | No | `localhost` | Development server host |
| `VITE_BUILD_SOURCEMAP` | No | `false` | Enable source maps in production |
| `VITE_DISABLE_TYPESCRIPT_CHECKER` | No | `false` | Disable TypeScript checker during build |
| `IS_DEBUG_MODE` | No | `false` | Enable debug mode |

## Documentation (arjuna-docs)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_DOCS_URL` | No | - | Documentation site URL |
| `REACT_APP_SERVER_BASE_URL` | No | - | Backend API URL (if needed) |
| `NODE_ENV` | No | `development` | Node environment |
| `PORT` | No | `3002` | Development server port |

## Website (arjuna-website)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Node environment |
| `PORT` | No | `3003` | Development server port |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Yes | - | GitHub OAuth client ID for CMS |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Yes | - | GitHub OAuth client secret for CMS |
| `KEYSTATIC_SECRET` | Yes | - | Keystatic secret key |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Yes | - | GitHub app slug for Keystatic |
| `NEXT_PUBLIC_APP_URL` | Yes | - | Main application URL |
| `REACT_APP_SERVER_BASE_URL` | No | - | Backend API URL (if needed) |

## Production Checklist

Before deploying to production, ensure:

- [ ] All required environment variables are set
- [ ] `APP_SECRET` is a strong random string
- [ ] Database credentials are secure
- [ ] Redis credentials are secure
- [ ] AWS credentials have minimal required permissions
- [ ] SSL certificates are configured
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Logging is configured
- [ ] Monitoring is set up

## Security Notes

- Never commit `.env` files to version control
- Use secrets management (AWS Secrets Manager, GitHub Secrets) for production
- Rotate secrets regularly
- Use different secrets for each environment
- Restrict access to production environment variables

