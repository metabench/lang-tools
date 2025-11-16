const Data_Value = require('../Data_Model/Data_Value');
const dv = new Data_Value([1,2,3]);
const imm = dv.toImmutable();
console.log('imm value', imm.value);
try {
  imm.value = 5;
} catch (err) {
  console.log('immutable throws');
}
