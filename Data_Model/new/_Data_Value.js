var jsgui = require('lang-mini');
//var Evented_Class = require('./_evented-class');

const Data_Model = require('../Data_Model');

const Immutable_Data_Model = require('./Immutable_Data_Model');
const Immutable_Data_Value = require('./Immutable_Data_Value');

const {is_defined, input_processors, field, tof, each} = jsgui;

// Just for the moment.
//const console = {
//    log: () => {}, trace: () => {}
//}


// Late 2023 - This part looks like it could easily become one of the really large and complex pieces of code.
//   Don't know if it could even wind up as 3000 lines?
//     For the moment, will get into really specific cases, handling them in the way that makes most sense.

// Will continue to work on using this to represent [lat,long] coords data, as well as a few other possibly more complex data models.
//   Need to be able to see on change events what was changed.
//    Tracking where the change was generated could help - it tracking which JS value was changed.
//     Could be the .value of a Data_Value.
//   Maybe do more to identify leaf data values?
//     As in ones that store (simple?) js variables such as string and number???

// Not sure of the better terminology like 'leaf', but maybe giving it 'js_value_change: true' could help.
//   Don't want to make the event objects too complex.
//     Especially to view.

// Showing the change values as being immutable could help.
//   Using immutable objects on a lower level could help keep some things certain.

// Though when they are immutable as standard JS objects like number and string, they would not need to be encapsulated like that.








const equals = (a, b) => {
    if (a === b) {
        return true;
    } else {

        if (a === undefined) return false;
        if (b === undefined) return false;

        const ta = typeof a;
        const tb = typeof b;

        // Are they both data_models????
        //   And is one but not the other a data_model???

        if (a instanceof Data_Model) {

            if (b instanceof Data_Model) {
                // Could get them as toImmutable();
                //   Then toString or toJSON???
                //     or_to_js_object???
                //     to_simple_js_object ??? the objects that would be jsonable easily.

                // could run equals on .value???



                //  and it would / should look at the current immutable data_value

                return a.equals(b);

                // better to call the .equals function of them....

                //const imm_a = a.toImmutable()





            } else {
                return a.equals(b);
            }

        } else {
            // do the comparison on the values....?


            if (b instanceof Data_Model) {
                // Could get them as toImmutable();
                //   Then toString or toJSON???
                //     or_to_js_object???
                //     to_simple_js_object ??? the objects that would be jsonable easily.

                // could run equals on .value???
                //  and it would / should look at the current immutable data_value
                return b.equals(a);

                // better to call the .equals function of them....
                //const imm_a = a.toImmutable()


            } else {
                // Neither of them are Data_Model....

                console.log('Neither of them are Data_Model');

                if (ta === tb) {

                    if (ta === 'string') {
                        return false;
                    } else if (ta === 'number') {
                        return false;
                    } else {

                        console.log('ta', ta);

                        console.trace();
                        throw 'NYI';

                    }

                } else {
                    // But maybe want to do Data_Model equals comparisons.
                    return false;
                }
                //return a.equals(b);
            }
        }

        // Are they both Data_Model objects?
        //   Could get them both as JSON?
        //   Or a hash?
        //   Or maybe first as immutable Data_Model objects?

        // maybe would go through the structure of a Data_Model....





    }
}







// What type is the value???

// Examples / tests of using this in this module could help.
//   Benchmarks too?

const util = require('util');
const lpurple = x => '\x1b[38;5;129m' + x + '\x1b[0m';

// Possibly this will use Immutable_Data_Value for handling changes.
//   Or even the values sent through in changes, are (always) immutable data models.
//     So it's clearer that the data for the change is the data only at one point in time.
//       Could have timestamp.
//       Could have int index of the change number.
//         Or both even.
//  May be nice to have a system that can track all of a data model's changes.
//    Would be nice to have it automatic on a lower level, and therefore 'for free' on a higher level.

// Specialised immutable data objects do seem like a decent way to represent data as it is in one state.
//   And that could be an old state.
// Want a simple enough higher-level API for these. Could have some lower level optimisations for it to involving UInt8Array storage.



// Data_Model .toImmutable();
//   Creates an immutable copy/clone.
//   .equals could compare with it.

// Immutable clones of data models definitely seem architecturally the right way to represent them while being clear that they hold the data
//   as it's represented at some point but are not the data model themselves.


















// Late 2023 First attempt at complete rewrite of Data_Value.
//   Will make it more comprehensive and able to handle what Data_Object can do.
//   Very verbose code may be OK here for the moment. Possibly wrap it in very explicitly named functions.
//     Maybe try for a but more DRY.
//     For the moment though, see that it does what is needed, including raising events as it should.

// Outer items will raise change (value change?) events when the inner value changes.
//   Value change events do seem simple enough.
//   But it may in reality be the same Data_Object as before.
//     Would be nice to have the precise data on what has changed.
//      Ie what (top level / leaf node) change (maybe to as JS-native type value) has changed, from what, to what,
//       and then how the change events have bublled / cascaded.

// (old, value) are fine when it's standard JS values. Comparsons with === are also fine with standard JS values.

// However, a value array can change, while it's still the same array.

// Maybe for the moment have 'inner-change' events?
//   No, continue with 'change' and 'value' events.
//   The value changes if a value inside it changes.

// So need to listen to some inner changes...
//  Like when there are Data_Value instances throughout an inner array, need to listen out for each of them changing.

// Could use code on the setters, though listening for Data_Value changes does seem best.
//   So when inner Data_Value instances get created, listen for their changes.

// Maybe have a 'path' array in the events.
//   Change listeners rather than more code on setters would be the way to do this.























// Ideally do want the full state represented as immutable data_values / when looking at the old / current values.
//   Maybe do want to get into passing through data on proposed changes that could be prevented.

// Maybe having a full list of changes could help.

// Maybe (even) keep track of all events that were raised.
//   Keeping track of the states it has been in, and could keep an array of the Immutable_Data_Value
//    objects that represent it.


// Possibly putting together an array of states it goes through would help.
//   Possibly giving 'initiator' events their own (quite long) unique IDS??? Or increment ints for it.
//     So setting data_object.value = ... would be one kind of change event, but then when that change event
//       is heard by its parent / container in the data_model, that parent / container would raise its own change event.
//       Though that own change event may benefit from using an immutable clone for old and (current) value.












class Data_Value extends Data_Model {

    constructor(spec = {}) {
        super(spec);
        this.__data_value = true;
        console.log('Data_Value (2.0)  constructor');

        const that = this;

        // Need to more fully integrate the immutable copies of Data_Value for changes.
        //   So the old and current returned values can be immutable clones.
        //     .value gets an immutable clone of a Data_Value - that would make a lot of sense ....???
        //     .immutable_value ???

        // Want to make conventions that go past .value.
        //   But be able to use .value appropriately.
        //     Maybe go for .inner_value ????

        // But for now focus more on functionality within the current API.
        //   Moving onto different properties, and encapsulating a JS object, so this could work 
        //     like a Data_Object, could help.


        // Possibly want more options about how much gets stored for each change.


        // Assigning a timestamp and code for each change could be useful....
        //   Want different options for change tracking.



        // return the old and current immutable values in change events.
        //   Maybe make some of that optional. Test perf.














        /*
        Functional_Data_Type

        
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

        // properties are within the value (kind of inner values)
        if (spec.property_data_types) this.property_data_types = spec.property_data_types;

        */

        // Want to make this capable of using data types.
        //   Data_Type could even be the 2nd param.
        //     Will use Functional_Data_Type for the moment.
        //       It's fairly simple.
        //       The boolean validate function is the main thing.


        // if spec.data_type....?

        //  set own data_type.
        //    then with set it will validate it.

        if (spec.data_type) this.data_type = spec.data_type;

        if (spec.context) {
            this.context = spec.context;
        }

        // So here field ('value') is doing most of the work here.

        //  Do want to see about setting up the sub-fields too....

        const {data_type, context} = this;
        
        if (data_type) {


            const {wrap_properties, property_names, property_data_types, wrap_value_inner_values, value_js_type,
                abbreviated_property_names, named_property_access, numbered_property_access} = data_type;


            let num_properties;

            if (property_names) {
                if (property_names.length === property_data_types.length) {
                    num_properties = property_names.length;


                    if (numbered_property_access) {
                        //console.log('will (possibly later on) set up numbered property access - num_properties:', num_properties);




                    }


                }
            }

            

            console.log('Data_Value 2.0 data_type.value_js_type', value_js_type);

            // Depending on the value in the spec???
            //   And create the new Data_Values inside that field???
            //     So when it gets set, it would create an internal Data_Value?
            //       Possibly make a lang-tools upgraded version of field(...).


            // Or there could be some inner field access systems?

            //console.log('Data_Value spec.value', spec.value);


            // Not so sure just field on the value is enough.
            //   Could improve field's handling of data types.
            //     May want more control over internal and automatical internal representation with other Data_Value objects.
            //       Using internal data values will help to make the API more flexible overall. That's a goal.
            //       Not only raw speed of data manipulation. It's a lot to do with taking care that the right changes register in the right
            //       way, and things respond efficiently and correctly to those changes. Should not have to deal with absolutely loads
            //         of data, the changes will often be relatively simple.




            // Just a 'value' field.
            //   Quite simple architecture for the moment.

            // Internal representation of the field using Data_Value????
            //   Or a field / value has its own internal data model?
            //     Or some kind of data model system?

            // Maybe relying on .keys in more cases???

            //   Having a value / field automatically set to a Data_Value could help.
            //    Maybe it would help by moving some of this to within lang-mini, or use dependency injection.


            // Or 'field' could access the Data_Value's (or other object's) own constructor, and create another one of them.

            // nest: true option??

            // same_type_nested????


            // .inner_value could be more helpful.
            // maybe a .wrap_value boolean option too?
            //    .inner_value would (always?) be an unwrapped value?

            // An input transformer to wrap it???

            // Maybe use Object.defineProperty instead here and make it more explicit.
            //   Also want a spec of what types the inner inner values are?

            // Set the property_data_types in the Data_Type....


            // But may want to set up accessors internally for the value...???
            //  As in it's an array of 

            //field(this, 'value', data_type, spec.value);

            

            // But will work somewhat differently for wrapped values.


            // See about wrapping properties inside that value?

            //  Or maybe is best to rename 'value' to 'inner_js_value'.
            //    In some cases we maybe would not want to store it unwrapped???
            //     The .value could iself be another Data_Value? And when it's changed with a setter,
            //      it would update the value in the current inner Data_Value???
            //  Though need to have some things inner on some level, could do it here.
            //  Though .inner_js_value does seem clearer (by a long way).

            // This class is getting somewhat complex now, but also more explicit.

            //console.log('Object.keys(data_type)', Object.keys(data_type));


            // .inner_value, .inner_js_value ???

            // .wrap_value???
            // .value_wrapping_mode? .value_wrapper???


            // .inner_value or inner_js_value even may help...?
            //   May need to create that inner_js_value even when it's asked for.

            // wrap_value_inner_values???



            let local_js_value;
            // data_type.value_js_type perhaps??
            //  inner_js_type ???

            // inner_value could help....


            

            let _current_immutable_value, _previous_immutable_value;

            // The 'value' property is complex!!!
            //   It's the main thing really.

            // register_value_change possibly.
            //   would update the state.

            const register_value_change = () => {

                console.log('---register_value_change---');
                console.trace();

                _previous_immutable_value = _current_immutable_value;
                _current_immutable_value = this.toImmutable();
            }

            // Need to be more careful about what happens in the code here...
            //   Need to have it handle a variety of different cases.
            //     Getting immutable values, and comparing them....


            Object.defineProperty(this, 'value', {
                get() {
                    return local_js_value;
                    //return _prop_value;
                },
                set(value) {

                    // First validate it....? Maybe not right now, could be parsed / transformed and then validated.

                    // Validating here may help after all.


                    // Needs to set differently if we already have the array (containing wrapped values)
                    //   Could individually change those values???
                    //     Don't want to raise change events with incomplete / inconsistent states where it's not useful.

                    let is_valid = data_type.validate(value);

                    if (!is_valid) {
                        // See about parsing and transformation (later maybe???)
                        //  Then revalidate
                    }



                    if (is_valid) {

                        // 


                        if (value_js_type === Array) {


                            console.log('value_js_type === Array');


                            // Wraps items inside an array....


                            // is the local local_js_value (array) set up already????
    
                            let t = tof(local_js_value);
                            console.log('t', t);

                            // Will see these already there in the future I expect.
                            if (t === 'undefined') {
                                // Create the new array, with the wrapped values....?
                                if (num_properties) {
                                    console.log('num_properties', num_properties);
                                    if (wrap_value_inner_values) {
                                        // 

                                        if (property_data_types) {
                                            let i = 0;


                                            // raise a change event with the index of the property.
                                            // i_property.

                                            const arr_wrapped_value_values = value.map(value => {


                                                // Then name of the Data_Value too...

                                                //   No name of the value in this case though....

                                                // would still be a 'value' change.
                                                //   Make basically everything a 'value' change for the moment.
                                                //   Maybe do want property_name in the event.
                                                //   property_index as well...



                                                const property_index = i;

                                                let property_name;
                                                if (property_names) {
                                                    property_name = property_names[property_index];
                                                }


                                                const wrapped_value = new Data_Value({context, value, data_type: property_data_types[i]});
                                                // name: 'value' as usual.
                                                //  though it may also have 'property_name', 'property_old', 'property_value'???
                                                
                                                // property_name, property_index, parent_event
                                                //   and the parent_event has the old and new value.
                                                
                                                // so could go up through a chain of parent_event objects.

                                                // wrapped value on change - raise own change event.
                                                //  maybe an event stack could be returned here???



                                                wrapped_value.on('change', e => {
                                                    // an equals comparison function could help a lot in some cases.
                                                    //   especially with arrays and objects, and some other things, maybe buffers

                                                    const {name} = e;

                                                    

                                                    if (name === 'value') {

                                                        register_value_change();

                                                        //console.log('1) _current_immutable_value', _current_immutable_value);
                                                        //console.log('1) _previous_immutable_value', _previous_immutable_value);

                                                        //_previous_immutable_value = _current_immutable_value;
                                                        //_current_immutable_value = that.toImmutable();

                                                        const my_e = {
                                                            name,
                                                            event_originator: wrapped_value,
                                                            parent_event: e,
                                                            old: _previous_immutable_value,
                                                            value: _current_immutable_value
                                                        }
                                                        if (property_name) {
                                                            my_e.property_name = property_name;
                                                        }
                                                        my_e.property_index = property_index;
                                                        that.raise('change', my_e);

                                                        

                                                        //console.log('2) _current_immutable_value', _current_immutable_value);
                                                        //console.log('2) _previous_immutable_value', _previous_immutable_value);
                                                    }

                                                    // Possibly the originator???

                                                    // event_originator property

                                                    




                                                    // 
                                                    // Possibly have some kind of 'old' value from before the change / any change?
                                                    // Harder to do that with an overall value.
                                                    //   Or before an inner value gets set, a warning gets done and values get saved
                                                    //   as immutable?

                                                    // Or use some trickery here to put back together the immutable Data_Value value from before.


                                                    // A pre-change event even????
                                                    //   Does make it more complex.

                                                    // Though it does make it harder to know what the full immutable data_model was
                                                    //   before the change.

                                                    // Anyway, see to storing the events and changes better / optionally.








                                                    // list these types by name when needed here....


                                                    // Also need to determine when to raise events, and how to raise them.

                                                    // Need to pass though change events, so that inner change events can be heard
                                                    //   when listening to the outer data_model.

                                                    // So be able to set up all the items inside the Data_Model, be able to listen
                                                    //   to targeted changes, but also be able to get every change (that makes it through?)
                                                    //     from listening to the .on change value.

                                                    // Will be using on change value extensively here.
                                                    //   Existing API will be used very specifically.

                                                    // do want .old and .value, but use immutable data_model options where possible.

                                                    








                                                    // if old and value are both js object types....
                                                    //   in fact, are both immutable by default js object types.

                                                    // not js container types.

                                                    // string, number, boolean, undefined, null

                                                    // simplest immutable??? js types.











                                                    // wrapped value on change value????

                                                    // So in this position is the old or new value a Data_Model itself?
                                                    //   Is it a Data_Value specifically?

                                                    // But when the wrapped value change, it is or it's treated as a value change.
                                                    //   Not sure about passing event stacks / chains on.

                                                    // Providing an event stack could make sense.
                                                    // .parent_event ???

                                                    // or just .parent???
                                                    // parent_event makes it much clearer to read.
                                                    //   If I return to it in 5 years I'd prefer it.
                                                    //    Then could also use a .parent shortcut / shorthand, perhaps optionally.
                                                    //     or proxy / getter? Hidden property with getter perhaps.













                                                    //console.log('Data_Value wrapped value change e', e);

                                                    // In this case, want to raise the change event on this.
                                                    //   

                                                    // Maybe we could have an old value (cloned?)

                                                    // Seems like more work needs to be done on object cloning.
                                                    //   Maybe object freezing as well.

                                                    // Making immutable clones or clone-like representations of Data_Model, Data_Value, Data_Object
                                                    //   will / may help.
                                                    // Could help with representing the old values of latitude and longitude.
                                                    //   Could allow more explicit and direct comparisons between old and new values.
                                                    // Though may also want to send 'diff' like objects over in change events.


                                                    






                                                })



                                                i++;
                                                return wrapped_value;
                                            });
                                            // then set the local js value to arr_wrapped_value_values

                                            local_js_value = arr_wrapped_value_values;

                                            //_previous_immutable_value = _current_immutable_value;
                                            //_current_immutable_value = that.toImmutable();

                                            register_value_change();

                                            // Then at this point should set the _current_immutable_value???

                                            // _previous_immutable_value???

                                            // and an array of all the immutable value states???



                                            // Data_Value.name could help (a lot?) too.
                                            //   Do want to make this system v flexible overall.
                                            //   Don't need to use all settings whenever it's used.


                                            // So would then have its value[0].value = system???





                                        } else {

                                        }

                                        

                                    } else {


                                    }

                                    //local_js_value = new Array(num_properties);
                                    // and then set the values according to the properties???
    
    
                                }
                            } else if (t === 'array') {
                                // 

                                console.trace();
                                throw 'NYI';
    
                            } else {
                                

                            }
    
    
    
    
                        } else {


                            // Need to be careful about what happens in which cases.

                            // When not processing an array internally, and it is valid.








    
                        }


                    }


                    // Need to be (more) specific about what happens or does not happen here.
                    //   There need to be some very specific code paths for some circumstances.


                    // if we are wrapping an array....?

                    // And depending on what the local_js_value_js_type is ????
                    //   Such as it being an array....





                    // does local_js_value already exist? is it an array?
                    // If it's an array, and we set it using .value, we could set its items by value???
                    //  

                    // Basically need to make this API very responsive to events that happen.

                    // Need to wrap the value inner values where necessary.
                    //   We would need the property types??
                    //    or shared_inner_value_type ???


                    // Late 2023 - A much more complex determination to make here....

                    // Setting up the local_js_value ????
                    //  inner_value actually I think...













                    // are we giving it a JS object or a Data_Model item...???

                    // Do we need to wrap properties inside this???

                    // Does get into deeper code and not just functional validation of plain js obects.
                    //  Should be relatively complex to make, at least quite a lot of details when not making it really
                    //  abstract to start with.

                    // An option to wrap the value (items inside that value) when it is set....?

                    // const wrapped_value = ....???

                    // Even making an internal Data_Array???
                    //   Best not to I think, but could wrap the values (properties) in the array.

                    // .inner_value could help.
                    //   and maybe it will contain wrapped inner inner items.

                    // wrap_properties may be worth focusing on.
                    //  Maybe should focus on that in the setter function of the defined property.

                    // May need to go into a lot of detail on this level for the moment making it very explicit.





                    // inner_js_object_but_with_wrapped_values_inside_it ????
                    // .ll perhaps for lower level access???
                    // Lower level access may differ to an API that always presents and accepts POJOs.

                    // .pojo = ...? get pojo() {...} ???













                    // Setting inner properties / wrapping inner properties, when the value is provided....

                    //console.log('setting prop: ' + prop_name);

                    // Not so sure about wrapped value and other inner js value???
                    //   Makes sense in some circumstances.



                    let old = local_js_value;


                    console.log('existing local_js_value', local_js_value);

                    // But if it's an array, and the value we are setting it to is also an array??

                    console.log('local_js_value instanceof Data_Value', local_js_value instanceof Data_Value);


                    // Specifically if it's undefined....

                    //  Create one, but need to know whether to wrap it in a Data_Value or not.

                    // // Possibly not - as this should be the Data_Value that wraps the value in some cases



                    if (local_js_value instanceof Data_Value) {
                        console.log('existing local_js_value instanceof Data_Value');
                        console.log('local_js_value.value', local_js_value.value);
                        console.log('local_js_value.data_type.name', local_js_value.data_type.name);

                    } else if (local_js_value instanceof Array) {
                        console.log('existing local_js_value instanceof Array');
                        //console.log('local_js_value.value', local_js_value.value);
                        //console.log('local_js_value.data_type.name', local_js_value.data_type.name);

                        console.log('local_js_value.length', local_js_value.length);
                        console.log('');

                        // Check that the local_js_value contains Data_Values???

                        // Then if it's the right length already....
                        //   And if it already contains Data_Value instances of the right .data_type ???

                        if (value instanceof Array) {
                            console.log('value instanceof Array');

                            // then check it's the expected length....?

                            if (property_names.length === value.length) {
                                console.log('value array has correct number of items to fit the properties: ' + value.length);

                                // Then set the existing items in the array...

                                if (property_data_types) {

                                    const num_properties = property_names.length;
                                    let i_property = 0;

                                    // Could set up numbered property access too.



                                    for (let i_property = 0; i_property < num_properties; i_property++) {
                                        const name = property_names[i_property];
                                        const data_type = property_data_types[i_property];

                                        console.log('[name, data_type]', [name, data_type]);

                                        // then set them according to the value....?

                                        if (local_js_value[i_property] instanceof Data_Value) {
                                            console.log('found internal property Data_Value');
                                            console.log('value[i_property]', value[i_property]);

                                            local_js_value[i_property].value = value[i_property];
                                        } else {

                                            // Otherwise just set it anyway....???
                                            console.trace();
                                            throw 'NYI';

                                        }
                                    }

                                    if (numbered_property_access) {
                                        for (let i_property = 0; i_property < num_properties; i_property++) {
                                            const name = property_names[i_property];
                                            const data_type = property_data_types[i_property];
                                            //console.log('[name, data_type]', [name, data_type]);
                                            // create getters and setters for the numbers.
                                            Object.defineProperty(this, i_property, {
                                                get() {
                                                    console.log('get i_property', i_property);
                                                    return local_js_value[i_property];
                                                },
                                                set(value) {
                                                    // Is the object already there a Data_Value or other Data_Model?
                                                    const item_already_there = local_js_value[i_property];
                                                    // Then is the value a Data_Model / Data_Value

                                                    if (item_already_there instanceof Data_Model) {
                                                        // Then set its value.

                                                        item_already_there.value = value;


                                                    } else {
                                                        // Should wrap it???
                                                        //   Should create a Data_Model???
                                                        //   Perhaps, perhaps not.
                                                        //     The internal value can be a normal JS object.
                                                        
                                                        console.log('item_already_there', item_already_there);

                                                        console.trace();
                                                        throw 'stop';



                                                    }




                                                    if (value instanceof Data_Model) {

                                                    } else {
                                                        // Should wrap it???

                                                    }


                                                }
                                            })
                                        }

                                        // setup the .length getter.
                                        //   Maybe unless it already has a property with that name....
                                        //     Could recommend against using that property name in some cases.

                                        Object.defineProperty(this, 'length', {
                                            get() {
                                                return local_js_value.length;
                                            }
                                        });
                                    }

                                    if (named_property_access) {

                                        // Go through the property names, also doing it by type???
                                        //   Have a way of combining the named and the numbered property access when there is both.

                                        if (numbered_property_access) {

                                            // then if property names...

                                            if (property_names) {

                                                for (let i_property = 0; i_property < num_properties; i_property++) {
                                                    const name = property_names[i_property];
                                                    const data_type = property_data_types[i_property];
                                                    //console.log('[name, data_type]', [name, data_type]);
                                                    // create getters and setters for the numbers.
                                                    Object.defineProperty(this, name, {
                                                        get() {
                                                            //console.log('get name (i_property)', name, i_property);
                                                            return local_js_value[i_property];
                                                        },
                                                        set(value) {
                                                            // Is the object already there a Data_Value or other Data_Model?
                                                            const item_already_there = local_js_value[i_property];
                                                            // Then is the value a Data_Model / Data_Value
        
                                                            if (item_already_there instanceof Data_Model) {
                                                                // Then set its value.
        
                                                                item_already_there.value = value;
        
        
                                                            } else {
                                                                // Should wrap it???
                                                                //   Should create a Data_Model???
                                                                //   Perhaps, perhaps not.
                                                                //     The internal value can be a normal JS object.
                                                                
                                                                console.log('item_already_there', item_already_there);
        
                                                                console.trace();
                                                                throw 'stop';
        
                                                            }
        
                                                            if (value instanceof Data_Model) {
        
                                                            } else {
                                                                // Should wrap it???
        
                                                            }
                                                        }
                                                    })
                                                }
                                            }

                                            if (abbreviated_property_names) {

                                                for (let i_property = 0; i_property < num_properties; i_property++) {
                                                    const name = abbreviated_property_names[i_property];
                                                    const data_type = property_data_types[i_property];
                                                    //console.log('[name, data_type]', [name, data_type]);
                                                    // create getters and setters for the numbers.
                                                    Object.defineProperty(this, name, {
                                                        get() {
                                                            //console.log('get name (i_property)', name, i_property);
                                                            return local_js_value[i_property];
                                                        },
                                                        set(value) {
                                                            // Is the object already there a Data_Value or other Data_Model?
                                                            const item_already_there = local_js_value[i_property];
                                                            // Then is the value a Data_Model / Data_Value
        
                                                            if (item_already_there instanceof Data_Model) {
                                                                // Then set its value.
        
                                                                item_already_there.value = value;
        
        
                                                            } else {
                                                                // Should wrap it???
                                                                //   Should create a Data_Model???
                                                                //   Perhaps, perhaps not.
                                                                //     The internal value can be a normal JS object.
                                                                
                                                                console.log('item_already_there', item_already_there);
        
                                                                console.trace();
                                                                throw 'stop';
        
        
        
                                                            }
        
                                                            if (value instanceof Data_Model) {
        
                                                            } else {
                                                                // Should wrap it???
        
                                                            }
        
        
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            console.log('');
                        }


                    } else {

                        // Basically need to implement a bunch of different options / ways of doing things here in Data_Value.

                        //  May be worth giving things explicit function names...?

                        //   Does seem like this will need plenty of more detailed implementation code.






                        // But should it be wrapped in a Data_Value?
                        //   When should it be wrapped in a Data_Value

                        if (old !== value) {

                            // Could do more checks at this point?
                            //   Or have a more specific / dedicated set of functions for when inner value values are wrapped?

                            // Definitely looks like the code is getting a lot more complex to support nested data_values.

                            // It is important to support this, so that higher level code can be really concise, powerful and
                            //   intuitive.





                            let is_valid = true;
                            if (data_type) {

                                is_valid = data_type.validate(value);

                                // if not valid directly, can we parse it from a string???

                                if (data_type.parse_string) {
                                    if (!is_valid && typeof value === 'string') {
                                        const parsed_value = data_type.parse_string(value);
                                        is_valid = data_type.validate(parsed_value);
                                        if (is_valid) value = parsed_value;
                                    }
                                }
                            }
                            // worth having a new 'equals' function for the moment.
                            //  Will (also) work with immutable data values.


                            if (old !== value && is_valid) {

                                console.log('old', old);
                                console.log('value', value);


                                // Some things will depend on the types.

                                // prior to setting it....

                                

                                local_js_value = value;



                                // But will we even get 'old' and 'value'???

                                // Not sure when these changes should take effect....

                                //_previous_immutable_value = _current_immutable_value;
                                //_current_immutable_value = that.toImmutable();

                                // Would depend on the value type.
                                //   Maybe would not create the immutable Data_Value....




                                register_value_change();


                                that.raise('change', {
                                    name: 'value',
                                    old: old,
                                    value: local_js_value
                                });
                            }
                        }

                    }


                    // value must be an array of length 2.

                    // Need data_value.equals function....

                    // and equal() function that would use .equals when it exists on an object.

                    
                }
            });

            // Lets deal with wrapped property access.
            // wrap_value_inner_values

            if (wrap_value_inner_values) {

                // Then wrap them in their various ways....

                // property_data_types could be important.

                // Would need to validate the data within the inner js value when setting them.

                // go through them by name...???

                if (property_names) {

                    const num_properties = property_names.length;
                    for (let index = 0; index < num_properties; index++) {
                        const name = property_names[index];
                        const data_type = property_data_types[index];

                        // So create the numeric accessors for those properties???





                        // set up the get / set on the index....?
                        //   But with the properties 'wrapped' they will need to be their own Data_Value instances.
                        //     Does seem like when setting .value, it should create Data_Values for inner objects, such as inside the array.

                        // wrap_inner property???

                        // Wrapping inner data inside Data_Value does seem important for recognising / responding to when it changes.
                        //  so .value.lat would register the change events too???

                        // Using .value (mainly) to set by value could be really useful???

                        // .inner_js_value could be helpful.
                        //   However in some cases, it would not exist???
                        //   Maybe in cases where the inner_value or inner_js_value contains values that themselves are data_values
                        //    it's not such a clear and explicit interface of just being a js value.

                        // .inner_value could help. More explicit than .value for the moment...?
                        //   Because the Data_Value really itself should represent a value (in a usable way)

                        
                        // Changing to .inner_value sooner rather than later could help.
                        //   Could also have the .value property (explicit Object.defineProperty) that may or may not
                        //     refer to the .inner_value or .inner_js_value
                        //     .inner_raw_js_value ??? .raw_js_value??? .pojo??? .toObject?? .toPOJO ???

                        // Be extra explicit about it for the moment.

















                        // Could set up the numbered property access here.

                    }

                }


                








            }




            // Could look at this.data_type.property_names as well.
            //   Then if necessary specifically create the property access here.
            //     Want this code to be specific enough that Data_Value would still work in other places in a more general purpose way.


            // But maybe we want .value to return a Data_Value itself???

            // Could see about autowrapping / autounwrapping values.


            // Autowrapping inner Data_Values does seem like it would be efficient on the higher level.

            // .autowrap_inner_data_values: true perhaps?






            //  Maybe using lower level property access for .value would help here.











            // data_type.property_types

            // data_type.wrap_properties.


            // Does seem as though we need the direct access rather than using 'field' for the moment.




            if (data_type.numbered_property_access === true) {
                // Then need to make an array, and create accessors for that array.

                // Only if the properties are named for the moment, as that's the only way we know how many...

                if (data_type.property_names) {
                    if (data_type.property_names.length <= 256) {
                        // Go through them creating accessors to the inner value...

                        console.log('should set up Data_Value 2.0 numbered property access');

                    }
                }
            }

        } else {
            console.log('Data_Value spec.value', spec.value);
            field(this, 'value', spec.value);
        }

        this.__type = 'data_value';
        // this.__data_type = ...
        // this.__data_type_name = ... ?

        //this._bound_events = {};
        this._relationships = {};

    }

    toImmutable() {
        // May be slightly difficult / tricky / complex.
        const {context, data_type, value} = this;

        // Create the new item...

        const res = new Immutable_Data_Value({
            context, data_type, value
        });

        return res;


    }

    'toObject'() {
        return this._;

    }

    // .value =
    //   Though .set could have more input, eg a format shifter????

    'set'(val) {
        this.value = val;
    }
    'get'() {
        return this.value;
    }
    [util.inspect.custom](depth, opts) {

        // OK for the moment.

        //return 'foo = ' + this.foo.toUpperCase();

        // But then display it in a specific color....

        // But the value - what format is that?
        //   If it's an array???
        //    Maybe need custom inspection code depending on the internal type....

        const {value} = this;

        if (value instanceof Array) {
            // could go through each item in that array.

            let res = '[ ';
            let first = true;

            each(value, item => {
                if (!first) {
                    res = res + ', ';
                } else {
                    first = false;
                }

                if (item instanceof Data_Model) {
                    const item_value = item.value;
                    res = res + lpurple(item_value)

                } else [
                    res = res + lpurple(item)
                ]

            })
            res = res + ' ]';
            return res;

        } else {
            return lpurple(this.value);
        }



        
    }




    'toString'() {
        //return stringify(this.get());
        // con
        //console.log('this._val ' + stringify(this._val));
        //throw 'stop';
        return this.get() + '';
    }
    // Maybe a particular stringify function?
    'toJSON'() {
        return JSON.stringify(this.get());
    }

    // Need to copy / clone the ._ value

    'clone'() {

        // Needs this.value
        //  And needs to clone all internal Data_Values.

        console.trace();
        throw 'NYI';

        
        var res = new Data_Value({
            'value': this._
        });
        return res;
    }

    // This is important to the running of jsgui3.
    //   Move to the lower level of Data_Model?


    '_id'() {
        if (this.__id) return this.__id;
        if (this.context) {
            //console.log('this.__type ' + this.__type);
            //throw 'stop';
            this.__id = this.context.new_id(this.__type_name || this.__type);
        } else {
            if (!is_defined(this.__id)) {
                throw 'Data_Value should have context';
                this.__id = new_data_value_id();
            }
        }
        return this.__id;
    }

    /*
    'parent'() {

        // Likely should (greatly) simplify this.
        //   Sometimes maybe would not be needed.


        var a = arguments; a.l = arguments.length; var sig = get_a_sig(a, 1);

        // .sibling_index instead. Clearer, matched HTML terminology in places.

        var obj, index;
        //console.log('parent sig', sig);
        if (a.l == 0) {
            return this._parent;
        } else if (a.l == 1) {
            obj = a[0];

            if (!this.context && obj.context) {
                this.context = obj.context;
            }

            var relate_by_id = function (that) {
                var obj_id = obj._id();
                that._relationships[obj_id] = true;
            }

            var relate_by_ref = function (that) {
                that._parent = obj;
            }
            relate_by_ref(this);
        } else if (a.l == 2) {
            obj = a[0];
            index = a[1];

            if (!this.context && obj.context) {
                this.context = obj.context;
            }

            this._parent = obj;
            this._index = index;
        }


        const unused_even_older_code = () => {
            if (is_defined(index)) {
                // I think we just set the __index property.
                //  I think a __parent property and a __index property would do the job here.
                //  Suits DOM heirachy.
                // A __relationships property could make sense for wider things, however, it would be easy (for the moment?)
                // to just have .__parent and .__index
                //
    
                // Not sure all Data_Objects will need contexts.
                //  It's mainly useful for Controls so far
            } else {
                // get the object's id...
    
                // setting the parent... the parent may have a context.
            }
        }
    }
    */
};

module.exports = Data_Value;
