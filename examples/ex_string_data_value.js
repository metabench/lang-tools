
const {Functional_Data_Type, tof, get_a_sig, get_item_sig, deep_sig} = require('lang-mini');

const Data_Value = require('../Data_Model/Data_Value');


const s_dv = new Data_Value({data_type: String});

s_dv.on('validate', e_validate => {
    console.log('e_validate', e_validate);
})
s_dv.on('change', e_change => {
    console.log('e_change', e_change);
})

console.log('s_dv', s_dv);
console.log('s_dv.data_type', s_dv.data_type);



// Strictly should not allow it to be set to a number.
//   Maybe could have some auto-stringify-numbers???


// Should raise a type or validation failure event.
//   

s_dv.value = 2;


s_dv.value = 1 + '';

s_dv.value = 'five';


console.log('s_dv', s_dv);