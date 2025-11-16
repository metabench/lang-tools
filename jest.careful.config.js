'use strict';

const base_config = require('./jest.config.js');

const unique = (items) => Array.from(new Set(items));

module.exports = {
	...base_config,
	bail: 1,
	maxWorkers: base_config.maxWorkers || '50%',
	testMatch: base_config.testMatch || ['**/test/**/*.test.js', '**/test/**/*.spec.js'],
	testPathIgnorePatterns: unique([
		...(base_config.testPathIgnorePatterns || []),
		'<rootDir>/exp/',
		'<rootDir>/examples/',
		'<rootDir>/tmp/'
	]),
	forceExit: false
};
