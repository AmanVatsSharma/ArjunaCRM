# Upstream Sync Playbook

This playbook defines how to safely synchronize ArjunaCRM with upstream
`twentyhq/twenty` changes.

## Why this playbook exists

This repository does not share git history with upstream, so traditional
`merge`/`rebase` update flows are not reliable.

To avoid regressions, we use a **wave-based snapshot sync** process:

1. generate drift report,
2. pick high-priority modules,
3. import changes in small slices,
4. validate builds/tests after each slice.

## Drift report command

Generate a drift report after updating the local upstream checkout:

```bash
python3 scripts/upstream-sync-drift-report.py \
  --upstream-path /tmp/twenty-upstream \
  --fork-path . \
  --output docs/deployment/reports/upstream-drift.json

python3 scripts/upstream-sync-priority-report.py \
  --input docs/deployment/reports/upstream-drift.json \
  --output docs/deployment/reports/upstream-sync-priority.md

python3 scripts/upstream-sync-wave-manifest.py \
  --input docs/deployment/reports/upstream-drift.json \
  --output-json docs/deployment/reports/upstream-wave-a-manifest.json \
  --output-md docs/deployment/reports/upstream-wave-a-manifest.md
```

The report includes:

- total file counts,
- missing files by package bucket,
- extra files by package bucket,
- sample missing and extra file lists.
- a markdown priority board of top missing/extra buckets.
- wave-specific manifests for runtime-critical buckets (`server`, `front`, `ui`, `shared`).

## Sync priority waves

## Wave A (P0): security + critical runtime correctness

- backend upgrade commands and migration safety
- auth/session/config hardening
- deployment pipeline integrity fixes

## Wave B (P1): product-critical feature parity

- front modules used in core CRM user flows
- server APIs required by those features

## Wave C (P2): non-critical parity and cleanup

- docs parity updates
- low-priority UI polish and infra cleanup

## Validation checklist for each sync slice

Run the following after each imported slice:

```bash
npx nx run arjuna-ui:build
npx nx run arjuna-emails:build
npx nx run arjuna-server:build
KEYSTATIC_GITHUB_CLIENT_ID=dummy \
KEYSTATIC_GITHUB_CLIENT_SECRET=dummy \
KEYSTATIC_SECRET=dummy \
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=dummy \
npx nx build arjuna-website
```

If any command fails:

1. revert the last partial import,
2. reduce the slice size,
3. retry with smaller scope.

## Reporting and traceability

For each wave:

- keep a markdown log of adopted/deferred upstream paths,
- attach test outputs,
- include migration or config side effects,
- record rollback notes.
