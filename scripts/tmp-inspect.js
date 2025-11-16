const {Functional_Data_Type, tof} = require('lang-mini');
const dt = Functional_Data_Type.integer;
console.log('typeof', typeof dt);
console.log('proto', Object.getPrototypeOf(dt)?.constructor?.name);
console.log('tof', tof(dt));
