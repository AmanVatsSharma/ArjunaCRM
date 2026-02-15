# Upstream Sync Priority Report

_Source: `/workspace/docs/deployment/reports/upstream-drift.json`_

## Snapshot Summary

- Upstream file count: **17475**
- Fork file count: **16085**
- Missing in fork: **5225**
- Extra in fork: **3835**

## Top Missing Buckets (Priority Candidates)

| Bucket                        | Missing file count |
| ----------------------------- | -----------------: |
| `packages/arjuna-docs`        |               1959 |
| `packages/arjuna-server`      |               1709 |
| `packages/arjuna-front`       |               1086 |
| `packages/arjuna-sdk`         |                214 |
| `packages/arjuna-shared`      |                159 |
| `packages/arjuna-docker`      |                 35 |
| `packages/arjuna-ui`          |                 16 |
| `packages/arjuna-apps`        |                 10 |
| `.github`                     |                  9 |
| `.cursor`                     |                  8 |
| `packages/arjuna-utils`       |                  7 |
| `packages/arjuna-e2e-testing` |                  4 |
| `packages/arjuna-website`     |                  3 |
| `packages/arjuna-zapier`      |                  2 |
| `yarn.config.cjs`             |                  1 |

## Top Extra Buckets (Fork-only Deltas)

| Bucket                       | Extra file count |
| ---------------------------- | ---------------: |
| `packages/arjuna-docs`       |             2395 |
| `packages/arjuna-server`     |              805 |
| `packages/arjuna-front`      |              441 |
| `packages/arjuna-sdk`        |               53 |
| `packages/arjuna-apps`       |               33 |
| `packages/arjuna-zapier`     |               19 |
| `.github`                    |               15 |
| `packages/arjuna-shared`     |               15 |
| `docs`                       |               11 |
| `packages/arjuna-ui`         |                8 |
| `packages/arjuna-website`    |                7 |
| `packages/arjuna-docker`     |                5 |
| `.cache`                     |                4 |
| `scripts`                    |                4 |
| `packages/create-arjuna-app` |                3 |

## Recommended Next Wave

1. Prioritize high-impact `packages/arjuna-server` and `packages/arjuna-front` deltas.
2. Handle docs and website buckets after runtime-critical modules.
3. Keep each sync slice small, validated, and revertable.
