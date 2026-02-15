#!/usr/bin/env python3

import argparse
import json
from pathlib import Path


def parse_arguments() -> argparse.Namespace:
  argument_parser = argparse.ArgumentParser(
    description='Generate markdown priority report from upstream drift JSON.',
  )
  argument_parser.add_argument(
    '--input',
    default='docs/deployment/reports/upstream-drift.json',
    help='Path to upstream drift JSON report.',
  )
  argument_parser.add_argument(
    '--output',
    default='docs/deployment/reports/upstream-sync-priority.md',
    help='Path to write markdown priority report.',
  )
  argument_parser.add_argument(
    '--top-limit',
    type=int,
    default=15,
    help='How many top buckets to include per section.',
  )

  return argument_parser.parse_args()


def build_table_rows(items: list[list], top_limit: int) -> str:
  limited_items = items[:top_limit]

  if len(limited_items) == 0:
    return '| _none_ | 0 |\n'

  return ''.join(f'| `{bucket}` | {count} |\n' for bucket, count in limited_items)


def build_markdown_report(
  drift_report: dict,
  source_path: str,
  top_limit: int,
) -> str:
  missing_table_rows = build_table_rows(
    drift_report.get('missingInForkTopBuckets', []),
    top_limit=top_limit,
  )
  extra_table_rows = build_table_rows(
    drift_report.get('extraInForkTopBuckets', []),
    top_limit=top_limit,
  )

  return (
    '# Upstream Sync Priority Report\n\n'
    f'_Source: `{source_path}`_\n\n'
    '## Snapshot Summary\n\n'
    f"- Upstream file count: **{drift_report.get('upstreamFileCount', 0)}**\n"
    f"- Fork file count: **{drift_report.get('forkFileCount', 0)}**\n"
    f"- Missing in fork: **{drift_report.get('missingInForkCount', 0)}**\n"
    f"- Extra in fork: **{drift_report.get('extraInForkCount', 0)}**\n\n"
    '## Top Missing Buckets (Priority Candidates)\n\n'
    '| Bucket | Missing file count |\n'
    '| --- | ---: |\n'
    f'{missing_table_rows}\n'
    '## Top Extra Buckets (Fork-only Deltas)\n\n'
    '| Bucket | Extra file count |\n'
    '| --- | ---: |\n'
    f'{extra_table_rows}\n'
    '## Recommended Next Wave\n\n'
    '1. Prioritize high-impact `packages/arjuna-server` and `packages/arjuna-front` deltas.\n'
    '2. Handle docs and website buckets after runtime-critical modules.\n'
    '3. Keep each sync slice small, validated, and revertable.\n'
  )


def main() -> int:
  arguments = parse_arguments()

  input_path = Path(arguments.input).resolve()
  output_path = Path(arguments.output).resolve()

  if not input_path.exists():
    raise FileNotFoundError(
      f'Input drift report does not exist: {input_path.as_posix()}',
    )

  drift_report = json.loads(input_path.read_text(encoding='utf-8'))
  markdown_report = build_markdown_report(
    drift_report=drift_report,
    source_path=input_path.as_posix(),
    top_limit=arguments.top_limit,
  )

  output_path.parent.mkdir(parents=True, exist_ok=True)
  output_path.write_text(markdown_report, encoding='utf-8')
  print(f'Wrote priority report to {output_path.as_posix()}')

  return 0


if __name__ == '__main__':
  raise SystemExit(main())
