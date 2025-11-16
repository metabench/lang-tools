#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const runner = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const shell = process.platform === 'win32';
const root_dir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config_path = resolve(root_dir, 'jest.careful.config.js');

const run = (args) => {
	const result = spawnSync(runner, ['jest', '--config', config_path, ...args], {
		stdio: 'inherit',
		shell
	});
	const code = typeof result.status === 'number' ? result.status : 1;
	process.exit(code);
};

const normalize = (value) => value.replace(/\\/g, '/');
const looks_like_test_file = (value) => /\.(spec|test)\.[mc]?[jt]sx?$/i.test(normalize(value));

const main = () => {
	const raw_args = process.argv.slice(2);
	let list_only = raw_args.length === 0;
	const positional = [];
	const other_args = [];
	let after_double_dash = false;

	for (const arg of raw_args) {
		if (arg === '--list-only') {
			list_only = true;
			continue;
		}
		if (arg === '--') {
			after_double_dash = true;
			positional.push(arg);
			continue;
		}
		if (!after_double_dash && arg.startsWith('-')) {
			other_args.push(arg);
			continue;
		}
		positional.push(arg);
	}

	const file_candidates = positional.filter((arg) => arg !== '--');
	const use_run_by_path = file_candidates.length > 0 && file_candidates.every(looks_like_test_file);
	const selection = [];

	if (use_run_by_path) {
		selection.push('--runTestsByPath', ...file_candidates);
	} else {
		selection.push(...positional);
	}

	selection.push(...other_args);

	const base = ['--bail=1', '--maxWorkers=50%'];
	const final_args = list_only
		? [...base, ...selection, '--listTests']
		: [...base, ...selection];

	run(final_args);
};

main();
