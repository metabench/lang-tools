// This file aggregates all tests in the directory.
// Requiring the individual test files will register their tests with the node:test runner.
require('./test_data_integer.js');
require('./test_data_value.js');
require('./test_data_string.js');
require('./test_collection.js');

console.log("All tests have been loaded.");