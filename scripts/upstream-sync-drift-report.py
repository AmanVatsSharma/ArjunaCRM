#!/usr/bin/env python3

import argparse
import json
from collections import Counter
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class PathMapping:
  source_prefix: str
  target_prefix: str


PATH_MAPPINGS = [
  PathMapping('packages/twenty-front', 'packages/arjuna-front'),
  PathMapping('packages/twenty-server', 'packages/arjuna-server'),
  PathMapping('packages/twenty-ui', 'packages/arjuna-ui'),
  PathMapping('packages/twenty-shared', 'packages/arjuna-shared'),
  PathMapping('packages/twenty-utils', 'packages/arjuna-utils'),
  PathMapping('packages/twenty-emails', 'packages/arjuna-emails'),
  PathMapping('packages/twenty-website', 'packages/arjuna-website'),
  PathMapping('packages/twenty-docs', 'packages/arjuna-docs'),
  PathMapping('packages/twenty-zapier', 'packages/arjuna-zapier'),
  PathMapping('packages/twenty-cli', 'packages/arjuna-cli'),
  PathMapping('packages/twenty-sdk', 'packages/arjuna-sdk'),
  PathMapping('packages/twenty-apps', 'packages/arjuna-apps'),
  PathMapping('packages/create-twenty-app', 'packages/create-arjuna-app'),
  PathMapping('packages/twenty-e2e-testing', 'packages/arjuna-e2e-testing'),
  PathMapping('packages/twenty-docker', 'packages/arjuna-docker'),
  PathMapping('packages/twenty-eslint-rules', 'tools/eslint-rules'),
]

IGNORE_PATH_MARKERS = {
  '.git',
  'node_modules',
  '.next',
  'dist',
  'build',
  '.nx',
  '.yarn/cache',
  '.yarn/unplugged',
}


def should_ignore_path(path: Path) -> bool:
  return any(path_marker in IGNORE_PATH_MARKERS for path_marker in path.parts)


def map_path(path: str, mappings: list[PathMapping]) -> str:
  for mapping in mappings:
    if path == mapping.source_prefix or path.startswith(
      f'{mapping.source_prefix}/',
    ):
      return f'{mapping.target_prefix}{path[len(mapping.source_prefix):]}'

  return path


def list_files(root_path: Path) -> list[str]:
  file_paths: list[str] = []

  for file_path in root_path.rglob('*'):
    if not file_path.is_file() or should_ignore_path(file_path):
      continue

    file_paths.append(file_path.relative_to(root_path).as_posix())

  return file_paths


def get_report_bucket(mapped_path: str) -> str:
  path_segments = mapped_path.split('/')

  if len(path_segments) < 2:
    return mapped_path

  if path_segments[0] == 'packages':
    return '/'.join(path_segments[:2])

  return path_segments[0]


def build_drift_report(
  upstream_root: Path,
  fork_root: Path,
  mappings: list[PathMapping],
) -> dict:
  upstream_file_paths = list_files(upstream_root)
  fork_file_paths = set(list_files(fork_root))

  mapped_upstream_paths = {
    upstream_path: map_path(upstream_path, mappings)
    for upstream_path in upstream_file_paths
  }

  missing_paths = [
    mapped_path
    for mapped_path in mapped_upstream_paths.values()
    if mapped_path not in fork_file_paths
  ]

  reverse_mappings = [
    PathMapping(mapping.target_prefix, mapping.source_prefix)
    for mapping in mappings
  ]

  upstream_path_set = set(upstream_file_paths)
  extra_paths = [
    fork_path
    for fork_path in fork_file_paths
    if map_path(fork_path, reverse_mappings) not in upstream_path_set
  ]

  missing_count_by_bucket = Counter(get_report_bucket(path) for path in missing_paths)
  extra_count_by_bucket = Counter(get_report_bucket(path) for path in extra_paths)

  return {
    'upstreamFileCount': len(upstream_file_paths),
    'forkFileCount': len(fork_file_paths),
    'missingInForkCount': len(missing_paths),
    'extraInForkCount': len(extra_paths),
    'missingInForkTopBuckets': missing_count_by_bucket.most_common(30),
    'extraInForkTopBuckets': extra_count_by_bucket.most_common(30),
    'missingInForkSample': missing_paths[:200],
    'extraInForkSample': extra_paths[:200],
  }


def parse_arguments() -> argparse.Namespace:
  argument_parser = argparse.ArgumentParser(
    description='Generate upstream drift report for ArjunaCRM fork.',
  )
  argument_parser.add_argument(
    '--upstream-path',
    default='/tmp/twenty-upstream',
    help='Path to upstream Twenty checkout.',
  )
  argument_parser.add_argument(
    '--fork-path',
    default='.',
    help='Path to ArjunaCRM fork checkout.',
  )
  argument_parser.add_argument(
    '--output',
    default='',
    help='Optional JSON file path where report will be written.',
  )

  return argument_parser.parse_args()


def main() -> int:
  arguments = parse_arguments()

  upstream_root = Path(arguments.upstream_path).resolve()
  fork_root = Path(arguments.fork_path).resolve()

  if not upstream_root.exists():
    raise FileNotFoundError(
      f'Upstream path does not exist: {upstream_root.as_posix()}',
    )

  if not fork_root.exists():
    raise FileNotFoundError(
      f'Fork path does not exist: {fork_root.as_posix()}',
    )

  drift_report = build_drift_report(
    upstream_root=upstream_root,
    fork_root=fork_root,
    mappings=PATH_MAPPINGS,
  )

  report_json = json.dumps(drift_report, indent=2)

  if arguments.output:
    output_path = Path(arguments.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(report_json, encoding='utf-8')
    print(f'Wrote drift report to {output_path.as_posix()}')
  else:
    print(report_json)

  return 0


if __name__ == '__main__':
  raise SystemExit(main())
