const fs = require('fs');
const file = process.argv[2];
try {
  const {size} = fs.statSync(file);
  console.log(file, size);
} catch (err) {
  console.error('stat failed', err.message);
}
