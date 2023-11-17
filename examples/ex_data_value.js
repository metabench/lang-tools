

// Data_Value should
//  1) Hold a value (or represent it maybe???)
//  2) Have .change event, raise it when the value changes.



// Data_Value that works as a specific type?

// Maybe need some lower-level lang-mini improved support of data types.
//   It has Grammar.
//   See about fairly comprehensive improvements on that level, or at least a simple way to support a very convenient API.

// here want new Data_Value(value, 'int') for example. Specifying with strings avoids having to get / import various refs as consts.

// could maybe do const Integer = 'int' etc ....

// use lang-mini.Functional_Data_Type


// Examples on this level, to do with defining the data value (and data object) types, using fields, would help.

const {Functional_Data_Type, tof, get_a_sig, get_item_sig, deep_sig} = require('lang-mini');

const Data_Value = require('../Data_Model/Data_Value');

// see about using it to model different types....?


// So a Functional_Data_Type may need a type to expose inner items / data items / values / data values.

// like a function that returns the fact it contains lat and long values, and what their ranges are limited to.
//  A function that gets info on the interface could help.
//   .api perhaps???
//   .api_description???
//   .describe???


// May be worth doing more to wrap .value so it will raise change events?
//   Maybe make a lower level ._value property, or .ll_value.
//    .wrapped_value perhaps, and then return that as .value, making the API clear.


// describe_inner_property_access()
//  'lat', '0' access... 
//    but then have the implementation wrap them in Data_Value instances???
//  



// sig property?
//  would be useful overall.
//    maybe.

// .description (as JS objects) could help.


// Ideally would abstract above descriptions of js types.

// Compound properties / data types.
//   Possibly something like structs.





// .description = {js_type: 'array', array_options: {length: 2}, fields: [['lat', 'latitude', 'float', {range: [-90, 90]}], ['long, ...]]}


//   May be easy enough to have a relatively dense description of what the data needs to represent.
//    Then could they be used to set field accessors?

// The Data_Value, or whatever specific implementation within Data_Model, would use .description data provided by the FDT in order to set
//  up field / property access.

// An extended detail sig that can also include range checks?
//   A signature expression even???

// And serialising / deserialising from binary and string.

// Basically want to present a convenient and predictable API to the high level programmer.

//   Would be nice to get this working better without a lot more code having to be written.

// Possibly being able to give it as an array / pair of lat, long or latitude, longitude.

// May be worth making use of types within a front-end / data system.
//   See about building them out of simpler ones...
//   Main thing in the lower / mid level code will be to support convenient and expressive syntax at the high level.


// .inner_value could somewhat help...?
//  Though maybe wrapping .value will always be fine???


const fdt_latitude = new Functional_Data_Type({
    name: 'latitude',
    value_js_type: Number,
    validate: x => {
        const tx = tof(x);
        //console.log('latitude tx', tx);
        // or get the sig.
        const sig_x = get_item_sig(x);
        //console.log('latitude sig_x', sig_x);
        if (sig_x === 'n') {
            // then are the within the right ranges...?
            // Latitude is specified in degrees within the range [-90, 90]. Longitude is specified in degrees within the range [-180, 180).
            if (x >= -90 && x <= 90) {
                return true;
            }
        } else if (sig_x === 'V') {
            // then are the within the right ranges...?
            // Latitude is specified in degrees within the range [-90, 90]. Longitude is specified in degrees within the range [-180, 180).
            return fdt_latitude.validate(x.value);
        }
        return false;
    }
});


// Something to say it's a number / integer???

const fdt_longitude = new Functional_Data_Type({
    name: 'longitude',
    value_js_type: Number,
    validate: x => {
        const tx = tof(x);
        // or get the sig.
        //console.log('longitude tx', tx);
        const sig_x = get_item_sig(x);
        //console.log('longitude sig_x', sig_x);
        if (sig_x === 'n') {
            // then are the within the right ranges...?
            // Latitude is specified in degrees within the range [-90, 90]. Longitude is specified in degrees within the range [-180, 180).
            if (x >= -180 && x <= 180) {
                return true;
            }
        } else if (sig_x === 'V') {
            // then are the within the right ranges...?
            // Latitude is specified in degrees within the range [-90, 90]. Longitude is specified in degrees within the range [-180, 180).
            return fdt_longitude.validate(x.value);
        }
        return false;
    }
});

// functional data type that is a pair / array of fdt_latitude, fdt_longitude
//  Functional_Data_Type_Pair perhaps...?

// Or validate both parts of the array separately.
//   Could have that clear in its validation function.
//   In this version, don't want to get as much into the definition of the data type, instead relying on functions
//   to do essental things such as validate.

// A functional data type that is a pair (array) of other data types...


// Maybe define some FDTs in terms of being a pair of other FDTs or DTs.

// Could have validate actually use the internal individual FDTs.

//  Though those names could be inherent in the data types... But in this more function orientated system it won't be so much about
//  getting info out of the composition of the data type.
// property_names: ['latitude', 'longitude']

// abbreviated_property_names

// Descriptive_Data_Type ???
// Compositional_Data_Type ???

// The Functional_Data_Type seems most directly useful for validation, maybe parsing too.
//   Want to get it working with string parsing too.

// May need a 'parse' function.
//   Would parse a string (by default?)
//   Could maybe parse other formats.



const fdt_lat_long = new Functional_Data_Type({
    name: '[latitude, longitude]',
    value_js_type: Array,
    named_property_access: true,
    property_names: ['latitude', 'longitude'],
    property_data_types: [fdt_latitude, fdt_longitude],
    // And the property types as well being the same in this case?
    abbreviated_property_names: ['lat', 'long'],
    numbered_property_access: true, // Maybe that's good enough to make it like an array when there are 2 properties.

    // wrap_value property???  maybe not because the Data_Value with this Data_Type does wrap that value already.


    //   so if it's an array it wraps that?
    // wrap_properties - does make sense, as properties may need to be their own Data_Value of that Data_Type.
    wrap_properties: true,
    wrap_value_inner_values: true,

    // wrap_value_inner_values???




    // zero_indexed_numbered_property_access perhaps???

    // something to say it's an array pair?
    //   maybe the 'sig'???
    // Here focus more on getting the validation working than using the definition.
    //   However, providing the definition / description could help.

    validate: x => {
        //console.log('x', x);
        //console.log('x.__data_value', x.__data_value);
        //console.log('x.value', x.value);


        if (x.__data_value) {
            // get the sig of that value...

            const dvv = x.value;
            return fdt_lat_long.validate(dvv);



        } else {
            const sig_x = get_a_sig(x);

            //console.log('sig_x', sig_x);

            // nice if a_sig did recognise data_value with .__data_value
            //   sig of 'V' perhaps? Or other sig that indicates a subtype???




            // 

            if (sig_x === '[n,n]') {
                const [lat, long] = x;
                return fdt_latitude.validate(lat) && fdt_longitude.validate(long);
            } else if (sig_x === '[V,V]') {

                // Probably not enumerable.... could be though.

                const [lat, long] = x;

                //console.log('[lat, long]', [lat, long]);

                // other data types need to be able to handle / validate Data_Values.
                //   Improve the tools to do / express that.
                

                return fdt_latitude.validate(lat) && fdt_longitude.validate(long);
            }
            return false;

        }

        // So, if it's a Data_Value....
        //   Or Data_Model even....
        //   Or Base_Data_Value???

        // is_data_value ???



        // a sig?
        // deep sig?


        // Not recognising inner Data_Values...?
        //  could slightly improve get_a_sig, and get_item_sig

        
    }
});

const old = () => {
    const fdt_lat_long = new Functional_Data_Type({

        // This won't deal with the details of Data_Value.
        //   Other way round

        

        name: '[latitude, longitude]',


        named_property_access: true,
        numbered_property_access: true, // Maybe that's good enough to make it like an array when there are 2 properties.
        //  so dv[0] would work - but return the Data_Value that wraps that property (probably)


        // A description of the properties could help the Data_Model / Data_Value / Data_Object / Collection assign the property accessors.
        //   Being able to access them as Data_Values would be helpful.

        // Could have this Functional_Data_Type very focused on the data type itself and relevant functions (a limited set of)
        //   while having advanced functionality to support it within Data_Model where and when appropriate.




        validate: x => {
            const tx = tof(x);
            // or get the sig.

            const sig_x = get_a_sig(x);

            //console.log('tx', tx);
            //console.log('sig_x', sig_x);

            if (sig_x === '[n,n]') {
                // then are the within the right ranges...?
                // Latitude is specified in degrees within the range [-90, 90]. Longitude is specified in degrees within the range [-180, 180).

                const [lat, long] = x;
                if (lat >= -90 && lat <= 90 && long >= -180 && long <= 180) {
                    return true;
                }

            } else {
                //return false;
            }

            return false;

            //console.trace();
            //throw 'stop';
        }
    });

}


// then can just use it to validate data....

// Only giving it the data type here....

// OK, so this is working reasonably well.
//   Could see about parsing them from string and JSON too....?

// So this instance should be able to model a Lat_Long piece of data.
//   Do want it to provide a convenient high-level API.
//     Using something so specific for the different pieces of data used in an app can / will help keep things clear,
//       and also have the classes already made in a way that allow them to be effectively connected with each other.

const simple_test = () => {


    const dv_ll = new Data_Value({data_type: fdt_lat_long});



    dv_ll.on('change', e => {
        console.log('dv_ll change e', e);

    })

    // Would be better for this not to raise intermediate events.
    //   Possibly....
    //   Maybe it should be treated as multiple changes for better app flow.
    //     Or have it make a change event that includes the multiple changed values?
    //     Or treat it as though it's changed it to a different array, being a single change.

    // Maybe an option for how it represents / raises changes for internal items that are being set by the outer change.
    //   Could help with some things being set in the UI specifically when one thing changes.


    // Change event granularity - that could be the issue.
    //   Also need to integrate parsing / autoparsing into the new Data_Value.
    //   Need to get it capable of parsing strings again.
    //     A default parsing system??? String to number makes sense as a default, not so sure what else....
    //     String to date, string to some other pieces of data.
    //   Display of units, such as degrees could help.
    //   Could integrate a unit_symbol property into the Data_Type / Functional_Data_Type.

    // For the moment, using Functional_Data_Type makes a lot of sense.
    //   It's more in accordance with what the JS program needs.











    dv_ll.value = [5, 6];

    console.log('dv_ll', dv_ll);

    dv_ll.lat = 15;

}

// This does seem like a quite complex, in-depth system that currently needs quite a few different code paths
//   Need to be clearer about how some things work, concerning mutability, and setting values within a mutable data_value
//   with values from an immutable one.

// Anything inside an immutable data_value must be immutable.   ????
// Mutable data_values can contain immutable ones ????
//   Maybe best not to, for the moment. ????
//     can_contain_immutable may be a good option.
//   Or maybe just for the moment that the values inside them that get created / copied are mutable data values.



const mutability = () => {

    const dv_ll_1 = new Data_Value({data_type: fdt_lat_long});
    console.log('dv_ll_1', dv_ll_1);

    console.log('');

    dv_ll_1.value = [7, 8];

    console.log('');
    console.log('dv_ll_1', dv_ll_1);
    console.log('dv_ll_1.value', dv_ll_1.value);
    console.log('');
    // Create an immutable copy, then create a new (mutable) Data_Value using that immutable copy.

    const immu_1 = dv_ll_1.toImmutable();
    console.log('immu_1', immu_1);
    console.log('immu_1.value', immu_1.value);

    // So applying an immutable value to a mutable data_value should still make all parts of the value
    //   (except specifically designated parts, NYI) mutable.



    // Create a new mutable one from that immutable one.

    // Assigning value from immutable to a mutable data value should not change of the mutability of the mutable one.
    //   Immutables will be used for storing and being sure to keep values in one state.
    //   They are great for snapshots, things to be passed around, representing when the value is fixed.
    //   When the value is being edited, a mutable Data_Value makes most sense logically.

    // Need to make sure the behaviour for these is correct.
    //  Setting .value from immutable dv

    // Need smoothness in the api where we don't need to write .value much, won't need to write it on a higher level
    //   when using these within a system.
    // The purpose of this currently lengthy Data_Value is to enable a higher level API that makes it convenient to use
    //   various features as standard, and for free in terms of code complexity, but not performance.







    const dv_ll_2 = new Data_Value({value: immu_1});

    console.log('dv_ll_2', dv_ll_2);
    // The (inner js) value itself should be an array.
    //   Though it should contain Data_Values so that the can raise the change events and have the advantages of Data_Value.





    console.log('dv_ll_2.value', dv_ll_2.value);





}

mutability();

const syncing_models = () => {

    // So, create a synced copy of a data_value or maybe data_model.

    // data_value.synced_clone ??? .synced_copy ???

    // or a function may be best overall.

    // Data_Value.synced_copy

    console.log('\nsyncing models \n');

    const sync_copy_data_value = (data_value, new_name) => {

        //console.log('sync_copy_data_value data_value', data_value);

        const o_dv_res = {value: data_value}
        if (data_value.data_type) {
            o_dv_res.data_type = data_value.data_type;
        }
        if (new_name) {
            o_dv_res.name = new_name;
        }
        //console.log('new_name', new_name);
        const res = new Data_Value(o_dv_res);

        // Would be nicest to sync the property changes...
        //   As in specifically and finely.

        //console.log('res', res);

        // Change event not working now...???

        data_value.on('change', e => {
            const {name, old, value} = e;

            

            //console.log('dv change e', e);

            if (name === 'value') {
                //console.log('pre set res value', value);
                res.value = value;
            }

            // If it's a change to a value....

            // But if it's a change to an inner value...?

        })

        // So need to be able to set a Data_Value using a Data_Value.

        res.on('change', e => {

            const {name, old, value} = e;

            //console.log('res dv change e', e);

            // If it's a change to a value....

            if (name === 'value') {
                data_value.value = value;
            }

            // But if it's a change to an inner value...?

        });

        data_value.on('validate', e => {
            //const {name, old, value} = e;
            console.log('dv validate e', e);
        });

        res.on('validate', e => {
            //const {name, old, value} = e;
            console.log('dv validate e', e);
        });

        // Validation events would also make a lot of sense, especially when showing and keeping updated validation status info
        //   in the UI.



        return res;
    }
    
    const dv_ll_1 = new Data_Value({data_type: fdt_lat_long, name: 'orig_ll'});

    // Value is currently undefined.

    // sync_copy_data_value should be simple if possible.

    // Data_Model or Data_Value visual designer will help.



    const dv_ll_2 = sync_copy_data_value(dv_ll_1, 'synced_copy_ll');

    dv_ll_1.value = [5, 6];
    //dv_ll_1.value = [7, 8];

    console.log('dv_ll_1', dv_ll_1);
    console.log('dv_ll_2', dv_ll_2);

    console.log('dv_ll_1.value', dv_ll_1.value);
    console.log('dv_ll_2.value', dv_ll_2.value);

    console.log('tof(dv_ll_1)', tof(dv_ll_1));
    console.log('tof(dv_ll_2)', tof(dv_ll_2));


    dv_ll_2.value = [9, 10];

    console.log('dv_ll_1', dv_ll_1);
    console.log('dv_ll_2', dv_ll_2);

    console.log('dv_ll_1.value', dv_ll_1.value);
    console.log('dv_ll_2.value', dv_ll_2.value);

    console.log('syncing models example complete----');

    // OK, looks reasonably good here so far.

    // Then want to implement a syncing function in the lib to make use of in higher level code.

    // Possibly also set up syncing with the UI with some good mid-level code.

    // Getting the validation state back...?
    // Raising a validation-fail event???
    // Or a failed-change or change-fail event?
    // invalid-change-attempt event???
    // validation-failure-on-change-attempt ???

    // Really explicit code and names will help a lot with readability.
    //   Especially when 











}
syncing_models();

// Maybe some more extensive tests as well?
//  Number of set operations per second?





// And see about syncing between two such data values.

// Or even 4 of them, like there would be in 2 controls that are synced.

// Making it so that the data model must stay valid, while the view model does not need to.
//   Or the view model has lesser validation rules.
//   View model would still parse, and validate, but can be recognised as being in an invalid state.


// data_value.validate???
//   Means 'validate' would become reserved when it comes to what property names can be assigned....
//    Or just that there would not be a 'validate' shortcut, it would be .value.validate in that case
//     Or test if .validate is a function?
//     Ignore that edge case for the moment?




// validate(data_value)
//   would compress (much) better too.

// Data_Value.validate so it can be referenced from the class, then used as its own function with very compressable calls.

// Need to have it able to store data that represents invalid states, such as when the user types such a state in.

// .valid ???
// .is_valid???
// ._is_valid???

// .vld8
// 










const also_old = () => {


    let old_im_value;
    dv_ll.on('change', e => {
        console.log('');

        console.log('dv_ll change e', e);

        if (old_im_value) {
            console.log('old_im_value', old_im_value);
        }

        // But the immutable copy somehow even gets changed!!!
        //   need to make sure these don't get changed by default.
        //    Eg if they are given an array, it needs to copy that array, and also copy the items inside.
        //      May depend what it's wrapping.

        



        const im_value = dv_ll.toImmutable();


        console.log('im_value', im_value);
        old_im_value = im_value;

        console.log('');

    })

    // Ideally? it would wrap that value?
    //  Or it does wrap the value itself.
    //  .value could return this - and .inner_value or .inner_js_value would be much more explicitly the inner / unwrapped value.
    //  .js even???

    // Setting the .value makes a lot of sense.
    //   Though the setter would need to detect if the input is wrapped, and setting .value should set by value (maybe this will be specific
    //   syntax to help with that - but it could autowrap the value when needed, 
    //   and get the inner value out of a wrapped param value, and autowrap that)


    // 

    console.log('dv_ll.data_type.property_names', dv_ll.data_type.property_names);
    console.log('dv_ll.data_type.abbreviated_property_names', dv_ll.data_type.abbreviated_property_names);
    console.log('dv_ll.data_type.named_property_access', dv_ll.data_type.named_property_access);
    console.log('dv_ll.data_type.numbered_property_access', dv_ll.data_type.numbered_property_access);
    console.log('dv_ll.data_type.wrap_properties', dv_ll.data_type.wrap_properties);
    console.log('dv_ll.data_type.wrap_value_inner_values', dv_ll.data_type.wrap_value_inner_values);
    // wrap_value_inner_values

    console.log('dv_ll.data_type.value_js_type', dv_ll.data_type.value_js_type);
    // value_js_type

    // Autowrapping the value could help???
    //   Though wrapping the properties on this level basically does that.

    dv_ll.value = [5, 60];



    // dv_ll.fields ?
    // dv_ll.keys ???


    // So if it has both named_property_access and numbered_property_access it's basically a key indexes array.
    //   Or a represent_as property too?  represent_as: Array ??? represent_as: Object ???
    //    js_type??? inner_js_type ???
    //  inner_js_type is the most explicit name so far.
    //    either Number, String, Object, Array, UInt8Array???
    //  

    // Setting an inner_js_type could help specify how a Data_Value works well, could be optional as well.
    //   Could be determined by how the property access works.


    console.log('2) dv_ll.value', dv_ll.value);

    // It should set up the keys / property accessors for array-like access.
    //  would have .length too.

    // has_length_property perhaps...

    console.log('2) dv_ll.length', dv_ll.length);


    // toObject??? JSON.stringify()...?

    // Seeing the data values output nicely in the console will help...



    // Direct numbered property access needs to be supported.
    //   When there are less than maybe 128 items, do so with fields / get set property access functions.
    //   When there are more ??? or always ??? use a Proxy object.
    //    May be tricky having it replace itself with a proxy object???
    //     Or could have inner Data_Value which it proxies access to.

    // Maybe manipulate the class as a value, and proxy totally around it???
    //   Not sure how right now.
    //     Possibly just support a maximum number of numerically indexed properties in the accessors for the moment.

    //  64 would be OK I suppose. Maybe even 256.








    // Nice - the change setting works, but need to raise event(s).
    //   Event will first be raised in that Data_Value.
    //   Need to have Data_Value listen to internal Data_Value / Data_Model changes.




    console.log('dv_ll[0]', dv_ll[0]);

    // then see about changing the values....


    dv_ll[0] = 6;

    // Should raise the change event on the lat long object.
    //   Could say that 'value.latitide' changed?
    //   Just a value change event perhaps.
    //     Then a sub_value property?
    //     or property_name ?
    //        property_value ?

    // Would be nice to make the events comprehensive and descriptive, while still concise.
    //   Perhaps the old value could be some kind of immutable clone of the value of the data_object.

    // Or comparing hashes of values could help.
    //   Need to move away from the '===' operator for the value comparison.

    // The objects could themselves be the same on changed to Data_Values and inner properties.

    // Need to be somewhat careful about raising the change events properly.








    console.log('dv_ll[0]', dv_ll[0]);

    // And have Data_Value set up the named property access too.

    console.log('dv_ll.latitude', dv_ll.latitude);
    console.log('dv_ll.longitude', dv_ll.longitude);

    console.log('dv_ll.lat', dv_ll.lat);
    console.log('dv_ll.long', dv_ll.long);


    dv_ll.lat = 7;

    // Not sure why printing the lat long normally (dv_ll) is coming out strange....


    console.log('dv_ll', dv_ll);
    console.log('dv_ll.value', dv_ll.value);
    // And the allowed types of property access...?

    const immdv_ll = dv_ll.toImmutable();

    console.log('immdv_ll', immdv_ll);

    dv_ll.lat = 7;
    console.log('dv_ll', dv_ll);

    dv_ll.lat = 8; // Nice, this does raise the change event.
    console.log('dv_ll', dv_ll);

}


/*


        if (spec.supertype) this.supertype = spec.supertype;
        if (spec.name) this.name = spec.name;
        if (spec.abbreviated_name) this.abbreviated_name = spec.abbreviated_name;
		if (spec.named_property_access) this.named_property_access = spec.named_property_access;
		if (spec.numbered_property_access) this.numbered_property_access = spec.numbered_property_access;
		if (spec.property_names) this.property_names = spec.property_names;
		if (spec.abbreviated_property_names) this.abbreviated_property_names = spec.abbreviated_property_names;
        if (spec.validate) this.validate = spec.validate;
        if (spec.validate_explain) this.validate_explain = spec.validate_explain;
		if (spec.parse_string) this.parse_string = spec.parse_string;
		if (spec.parse) this.parse = spec.parse;


*/


const value_change_tests = () => {


    // dv_ll.lat = ...
    const dv_ll = new Data_Value({data_type: fdt_lat_long});

    dv_ll.value = [5, 60];

    //console.log('dv_ll', dv_ll);

    console.log('dv_ll.value', dv_ll.value);

    // Be able to get a description of the Data_Type from that Data_Value?

    dv_ll.on('change', e => {
        console.log('dv_ll change e', e);
    })

    const dtn = dv_ll.data_type.name;

    console.log('dtn', dtn);

    // But having it recognise a change event of one of the items in the .value array would be helpful.
    //   so having it present a fake / proxied .value???
    //   Maybe even better, to wrap / enclose both the values within their own Data_Value instances?
    //     Or having it present a fake .value is the right way???
    //      Maybe not...
    //   Just dv_ll[0] = new_lat
    //   dv_ll.lat = new_lat
    //   dv_ll.value[0] = new_lat would not raise the change event if the value object is an array.
    //     Though a wrapped array of some sort would raise that change event.











    // dv_ll.lat.value = ...
    // dv_ll[0].value = ...
    // dv_ll.lat = ...   - that does seem simplest in a way.



    // dv_ll[0] = ...




    // But then would want it to operate as a Data_Array (or even Data_Pair_Array???) so that changes to items in the array raise the change event.
    //   That would require some lower level setting (all sorts of???) things / objects up as Data_Value or Data_Object.
    //   Some kind of wrapper for an array, or Fake_Array even???

    // But a change event...?
    //  Would want setting an item in an array to register a change event.



    // If the .value itself was something else, maybe proxied, maybe using setters and setters, would could have it
    //   recognise changes with the below API.


    // Nice if this raised an event.


    // This will need to wrap a number or other basic js type in a Data_Value.
    //   A specific type of 'set' operation that references by an integer index.
    //   So need to modify that specific 'set' operation so it wraps numbers and some other types.
    //    Suppose it would need to wrap objects and arrays too, could look into that later on.




    // Will need to be very careful not to refer to .value[number] when .value is a js array]
    //  Likely want to use .value to set by value where possible....?
    //   make it clearer by using .inner_js_value ???
    //    .inner_js_value_that_could_even_be_an_array_or_object_so_be_careful_about_doing_array_open_sqbrakets_index_close_sqbrackets_and_expecting_the_change_event_to_fire






    dv_ll[1] = 55;



    console.log('dv_ll.value', dv_ll.value);

    // Outer Data_Value needs to listen to the change events of the inner ones.
    //   Data_Value is indeed quite a complex system.
    //     It should enable a helpful dynamism with the data in the apps.
    //     Needs to make things (much) easier to do.
    //     






    const _and_more = () => {

        dv_ll.value = [-20, 30];


        console.log('dv_ll.value', dv_ll.value);

        dv_ll.value = [-200, 30]; // That assignment won't make a change.
        // Maybe there should be an event saying a value change failed.

        console.log('dv_ll.value', dv_ll.value);

        console.log('dv_ll.lat', dv_ll.lat);
        console.log('dv_ll.long', dv_ll.long);
    }

    _and_more();

    

}
//value_change_tests();

// See about looking inside or inspecting its fields / keys...?
