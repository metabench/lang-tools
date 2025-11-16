#!/usr/bin/env node
'use strict';

const { spawnSync } = require('node:child_process');
const { mkdirSync, writeFileSync } = require('node:fs');
const { dirname, resolve } = require('node:path');

const args = process.argv.slice(2);
if (args.length === 0) {
	console.error('Usage: node scripts/capture-list-tests.js <output> -- <jest args>');
	process.exit(1);
}

const output = resolve(args[0]);
const split_index = args.indexOf('--');
const jest_args = split_index === -1 ? args.slice(1) : args.slice(split_index + 1);

const final_args = jest_args.includes('--listTests') ? jest_args : [...jest_args, '--listTests'];
const runner = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const command = ['jest', ...final_args];
const result = spawnSync(runner, command, {
	encoding: 'utf8',
	shell: process.platform === 'win32'
});

if (result.error) {
	throw result.error;
}

if (result.status !== 0) {
	process.stderr.write(result.stdout || '');
	process.stderr.write(result.stderr || '');
	process.exit(result.status);
}

const tests = result.stdout
	.split(/\r?\n/)
	.map(line => line.trim())
	.filter(Boolean);

const payload = {
	command: [runner, ...command],
	tests
};

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify(payload, null, 2));
