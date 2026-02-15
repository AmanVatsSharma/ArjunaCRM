# Observability and Alerting Guide

This guide defines the baseline telemetry and alerting setup required for
production readiness.

## Core telemetry signals

## API (backend)

- Request throughput (requests per minute)
- Error rate (5xx and 4xx trends)
- Latency (p50, p95, p99)
- Process health (CPU, memory, restarts)

## Worker

- Queue depth
- Job processing latency
- Job failure rate and retry volume
- Worker restarts

## Data services

- RDS CPU, memory, storage, connection count
- Slow query trends
- Redis memory pressure, evictions, connection count

## Alert policy baseline

## Critical (page immediately)

- API health check failing for > 5 minutes
- API 5xx error rate above threshold for > 10 minutes
- Worker unable to consume queue for > 10 minutes
- RDS unavailable or storage critically low

## High (respond quickly)

- Sustained p95 latency degradation
- Elevated job failure rate
- Redis memory pressure near limit

## Medium (business-hours triage)

- Increased 4xx rates
- CloudFront cache miss anomalies
- Spiky but non-sustained CPU/memory usage

## Logging requirements

- Centralized application logs for API and worker
- Correlation IDs included in request/job logs
- Structured error logs (message, code, stack, context)
- Retention policy aligned to compliance requirements

## Dashboard minimum set

1. **Executive health dashboard**
   - API availability
   - Error rate
   - Release marker annotations
2. **Backend performance dashboard**
   - Latency percentiles
   - Route-level error concentration
3. **Worker and queue dashboard**
   - Queue depth
   - Failure/retry breakdown
4. **Data layer dashboard**
   - RDS + Redis health

## Release monitoring checklist

- Monitor first 30 minutes after deployment for error spikes.
- Compare p95 latency before/after release.
- Confirm worker queue depth remains stable.
- Confirm no new critical alerts fired.
