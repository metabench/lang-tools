
const {Functional_Data_Type, tof, get_a_sig, get_item_sig, deep_sig} = require('lang-mini');

const Data_Value = require('../Data_Model/Data_Value');


const s_dv = new Data_Value({data_type: String});
const i_dv = new Data_Value({data_type: Functional_Data_Type.integer});

// May need to formalise rules about parsing, outputting as string, getting and setting.
//   So when a string type is set with a number, it could automatically perform toString, maybe even JSON.stringify(number);
//   An option to automatically toString when a string data type is given a number....
//     And the number data type knows how to parse from string.








//const i_dv = new Data_Value({data_type: String});

s_dv.on('validate', e_validate => {
    console.log('s_dv e_validate', e_validate);
})
s_dv.on('change', e_change => {
    console.log('s_dv e_change', e_change);

    //i_dv.value = e_change.value;

    i_dv.attempt_set_value(e_change.value);

})


i_dv.on('validate', e_validate => {
    console.log('i_dv e_validate', e_validate);
})
i_dv.on('change', e_change => {
    console.log('i_dv e_change', e_change);

    //s_dv.value = e_change.value + '';
    s_dv.attempt_set_value(e_change.value);
})

// And sync them with each other....


//i_dv.value = 8;


// But when using .value = ....?
//   Maybe use the same code path as attempt_set_value.
//     attempt_set_value helps by being more explicit on if the set value has worked ok.





i_dv.value = 8;

s_dv.value = '9';

console.log('i_dv.value', i_dv.value);
console.log('s_dv.value', s_dv.value);