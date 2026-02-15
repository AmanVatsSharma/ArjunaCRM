#!/usr/bin/env python3

import argparse
import json
from collections import defaultdict
from pathlib import Path


DEFAULT_BUCKETS = [
  'packages/arjuna-server',
  'packages/arjuna-front',
  'packages/arjuna-ui',
  'packages/arjuna-shared',
]


def parse_arguments() -> argparse.Namespace:
  argument_parser = argparse.ArgumentParser(
    description='Create focused wave manifest from upstream drift report.',
  )
  argument_parser.add_argument(
    '--input',
    default='docs/deployment/reports/upstream-drift.json',
    help='Path to drift JSON report.',
  )
  argument_parser.add_argument(
    '--output-json',
    default='docs/deployment/reports/upstream-wave-a-manifest.json',
    help='Path for generated wave manifest JSON.',
  )
  argument_parser.add_argument(
    '--output-md',
    default='docs/deployment/reports/upstream-wave-a-manifest.md',
    help='Path for generated wave manifest markdown.',
  )
  argument_parser.add_argument(
    '--sample-limit',
    type=int,
    default=80,
    help='How many sample paths to include in markdown per bucket.',
  )
  argument_parser.add_argument(
    '--buckets',
    nargs='*',
    default=DEFAULT_BUCKETS,
    help='Bucket prefixes to include in manifest.',
  )

  return argument_parser.parse_args()


def load_drift_report(path: Path) -> dict:
  if not path.exists():
    raise FileNotFoundError(f'Drift report not found: {path.as_posix()}')

  return json.loads(path.read_text(encoding='utf-8'))


def build_manifest(
  missing_paths: list[str],
  bucket_prefixes: list[str],
) -> dict[str, list[str]]:
  grouped_paths: dict[str, list[str]] = defaultdict(list)

  for missing_path in missing_paths:
    for bucket_prefix in bucket_prefixes:
      if missing_path.startswith(f'{bucket_prefix}/') or missing_path == bucket_prefix:
        grouped_paths[bucket_prefix].append(missing_path)
        break

  return {bucket: sorted(grouped_paths.get(bucket, [])) for bucket in bucket_prefixes}


def build_markdown(manifest: dict[str, list[str]], sample_limit: int) -> str:
  lines: list[str] = [
    '# Upstream Wave A Manifest',
    '',
    'Focused missing-file manifest for runtime-critical sync buckets.',
    '',
  ]

  for bucket_name, bucket_paths in manifest.items():
    lines.append(f'## {bucket_name}')
    lines.append('')
    lines.append(f'- Missing file count: **{len(bucket_paths)}**')
    lines.append('')

    if len(bucket_paths) == 0:
      lines.append('_No missing files for this bucket._')
      lines.append('')
      continue

    lines.append('### Sample paths')
    lines.append('')

    for missing_path in bucket_paths[:sample_limit]:
      lines.append(f'- `{missing_path}`')

    if len(bucket_paths) > sample_limit:
      lines.append(
        f'- _... {len(bucket_paths) - sample_limit} additional files omitted from markdown sample_',
      )

    lines.append('')

  return '\n'.join(lines)


def main() -> int:
  arguments = parse_arguments()

  drift_report_path = Path(arguments.input).resolve()
  output_json_path = Path(arguments.output_json).resolve()
  output_md_path = Path(arguments.output_md).resolve()

  drift_report = load_drift_report(drift_report_path)
  missing_paths = drift_report.get('missingInFork', [])

  if len(missing_paths) == 0:
    missing_paths = drift_report.get('missingInForkSample', [])

  manifest = build_manifest(
    missing_paths=missing_paths,
    bucket_prefixes=arguments.buckets,
  )

  output_json_path.parent.mkdir(parents=True, exist_ok=True)
  output_json_path.write_text(
    json.dumps(manifest, indent=2),
    encoding='utf-8',
  )

  output_md_path.parent.mkdir(parents=True, exist_ok=True)
  output_md_path.write_text(
    build_markdown(manifest, sample_limit=arguments.sample_limit),
    encoding='utf-8',
  )

  print(f'Wrote manifest JSON to {output_json_path.as_posix()}')
  print(f'Wrote manifest markdown to {output_md_path.as_posix()}')

  return 0


if __name__ == '__main__':
  raise SystemExit(main())
