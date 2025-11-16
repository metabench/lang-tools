const Data_Value = require('../Data_Model/Data_Value');
try {
  const dv = new Data_Value({value: 3, data_type: Number});
  console.log('dv', dv.value);
} catch (err) {
  console.error('error', err);
}
