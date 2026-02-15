# Launch Readiness Checklist

Use this checklist before announcing production availability.

## Release governance

- [ ] Release tag created from reviewed commit.
- [ ] Release notes generated and validated.
- [ ] Rollback owner assigned for release window.
- [ ] Incident channel prepared with on-call coverage.

## Infrastructure and platform

- [ ] ECS backend service stable on desired count.
- [ ] ECS website service stable on desired count.
- [ ] Frontend/docs static hosting healthy (S3 + CloudFront).
- [ ] RDS backups enabled and latest snapshot verified.
- [ ] Redis health and memory policy verified.
- [ ] TLS certificates valid for all public domains.

## Security baseline

- [ ] `APP_SECRET` rotated and stored in secret manager.
- [ ] Production secrets are not hardcoded in workflows.
- [ ] CORS allowlist is configured for production origins.
- [ ] IAM permissions are least-privilege reviewed.
- [ ] Audit logs and access logs are retained.

## Application validation

- [ ] Backend health endpoint returns healthy.
- [ ] Frontend sign-in and sign-up paths work.
- [ ] Core CRM CRUD flows validated in production-like environment.
- [ ] Worker jobs process successfully.
- [ ] Email sending and password reset flows validated.

## Marketing and onboarding

- [ ] Marketing homepage (`/`) validated on production domain.
- [ ] Pricing/story/jobs/legal routes validated.
- [ ] CTA buttons route to onboarding correctly.
- [ ] Analytics and conversion tracking events verified.

## Observability and operations

- [ ] Error monitoring dashboard reviewed (last 24h).
- [ ] API latency and error-rate alerts active.
- [ ] Runbooks available to on-call engineers.
- [ ] Backup restore drill completed within agreed RTO/RPO.

## Final go/no-go

- [ ] Stakeholders approved go-live.
- [ ] Known risks and mitigations documented.
- [ ] Launch communication plan ready.
