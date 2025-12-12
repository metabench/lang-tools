const jsgui = require('lang-mini');

const {each, tof, is_defined, get_a_sig, ll_get} = jsgui;


const Mini_Context = require('../Mini_Context');
const Data_Model = require('../Data_Model');
const Data_Value = require('./Data_Value');

// 2022 - Looks like it could be modified into being Model, or part of one.
// 2023 - In the process of doing this.
//        Could also use the now quite old but little used mfp, and also begin using fp again.
//        The functions that allow clearer and more concise functions would prove very useful at this stage.
//        Now the jsgui system essentialy works, can put abstractions in place which showing / proving it still works.





//var Evented_Class = require('./_evented-class');
//var Data_Structures = require('./jsgui-data-structures');

//var Constraint = require('./constraint');
//var Fields_Collection = require('./fields-collection');
//var Collection = require('jsgui2-collection');

/*

var j = jsgui;
var Evented_Class = j.Evented_Class;
var Class = j.Class;
var each = j.each;
var is_array = j.is_array;
var is_dom_node = j.is_dom_node;
var is_ctrl = j.is_ctrl;
var extend = j.extend;
var get_truth_map_from_arr = j.get_truth_map_from_arr;
var get_map_from_arr = j.get_map_from_arr;
var arr_like_to_arr = j.arr_like_to_arr;
var tof = j.tof;
var is_defined = j.is_defined;
var stringify = j.stringify;
var functional_polymorphism = j.functional_polymorphism;
var fp = j.fp;
var arrayify = j.arrayify;
var mapify = j.mapify;
var are_equal = j.are_equal;
var get_item_sig = j.get_item_sig;
var get_a_sig = j.get_a_sig;
var set_vals = j.set_vals;
var truth = j.truth;
var trim_sig_brackets = j.trim_sig_brackets;
var ll_set = j.ll_set;
var ll_get = j.ll_get;
var input_processors = j.input_processors;
var iterate_ancestor_classes = j.iterate_ancestor_classes;
var is_arr_of_arrs = j.is_arr_of_arrs;
var is_arr_of_strs = j.is_arr_of_strs;
var is_arr_of_t = j.is_arr_of_t;
var clone = jsgui.clone;
var data_value_index = 0;
//var data_value_abbreviation = 'val';

*/

// do data objects get an ID when they are initialized???
//   Better to make context dependent?

jsgui.__data_id_method = 'init';


// Seems worthwhile to get rid of constraint matching and fields.
//  Constraint matching will be added back in using a more functional system.
//  Indexing should be put down to a simple process that calls some simple functions.
//   It has got way too complicated so far. We need to map between an object (reading specific properties) and an array value.
//    The lists of keys for these items will be stored within a sorted structure.

// Data_Object and Data_Value both being Data_Item????
// Or Data_Model ????

// Or within a 'Model' category.
//   This is working now as the 'M' within 'MVC' or 'CMVM'

// data-model directory overall???
// data_model_base perhaps????

// or just start at data_model Data_Model for now.



// Get fields key from object.
//  Worth keeping consistent and formatted notes about what the fields key is.
//  Possibly will still use some object oriented structures. Complex OO structures are easier to understand than bunches of variables.

// However, an improved function that calculates field keys from objects makes sense.
//  May not be impossible to fix things from this codebase.

// Just not sure about the indexing right now.


// This seems a little bit like 'Model'.





//var obj_matches_constraint = Constraint.obj_matches_constraint;
//var native_constructor_tof = jsgui.native_constructor_tof;

//var value_as_field_constraint = Constraint.value_as_field_constraint;

//var Ordered_String_List = Data_Structures.Ordered_String_List;

var is_js_native = function (obj) {
    var t = tof(obj);

    // other types????
    return t == 'number' || t == 'string' || t == 'boolean' || t == 'array';
};

// Seems as though fields are not important to how these work effectively (fields being in obext / oext)

class Data_Object extends Data_Model {
    constructor(spec = {}, fields) {
        //console.log('1* spec.__type_name', spec.__type_name);
        super(spec);
        this._ = this._ || {};
        if (spec.id) {
			this.__id = spec.id;
		}
		if (spec.__id) {
			this.__id = spec.__id;
		}
        this.__type_name = spec.__type_name || 'data_object';

        // And set the data_type???
        //   Even different ways of doing data type and data type checks?

        // Validation function...
        //   Maybe not necessarily data type, but more specific to that field / value.




        // Will be better to use obext for fields.

        // Does seem worth not using this any longer....
        //   Replace with something more powerful?

        // Moving obext field to lang-mini could help....
        //   Copying it there, for the moment.
        //     Could even modify obext so it passes through fields from lang-mini.


        // A better system to set / assign fields?
        //   Can break backward compatibility a bit in the new version.


        if (fields) this.set_fields_from_spec(fields, spec);



        // Should incorporate data types within fields.
        //   Maybe grammer too....?

        this.__data_object = true;
        
        // Basically never using abstract specs any longer.
        //   Could maybe be abstract or not depending on context.

        if (spec.abstract === true) {
            this._abstract = true;
            var tSpec = tof(spec);

            if (tSpec == 'function') {
                this._type_constructor = spec;
                // could possibly
                // but maybe want to keep this json-friendly.

                // the type constructor could be used in a collection.
                //  could be more leightweight than other things? specific constraint objects.
            } else if (tSpec == 'object') {
                this._spec = spec;
                // could possibly
                // but maybe want to keep this json-friendly.

                // the type constructor could be used in a collection.
                //  could be more leightweight than other things? specific constraint objects.
            }

        } else {
            //var that = this;
            //this._initializing = true;

            var t_spec = tof(spec);
            //console.log('t_spec', t_spec);

            if (!this.__type) {
                this.__type = 'data_object';
            }

            // 18/12/2016 getting rid of ._

            //if (!this.hasOwnProperty('_')) {
            //    this._ = {};
            //}

            //console.log('t_spec', t_spec);

            // Maybe could check for actual controls better.
            if (t_spec === 'object' || t_spec === 'control') {
                // Normal initialization

                if (spec.context) {
                    //console.log('spec has context');
                    this.context = spec.context;
                }
                if (spec.id) {
                    this.__id = spec.id;
                }
                if (spec._id) {
                    this.__id = spec._id;
                }
                if (spec.__id) {
                    this.__id = spec.__id;
                }
                //console.log('this.__id', this.__id);
                // want to see if we are using any of the spec items as fields.
            } else if (t_spec == 'data_object') {
                // Initialization by Data_Object value (for the moment)
                // Not so sure about copying the id of another object.
                if (spec.context) this.context = spec.context;
                // then copy the values over from spec
                
                /*.
                //var spec_keys = spec.keys();
                //console.log('spec_keys', spec_keys);
                each(spec_keys, function (i, key) {
                    //that.set(key, spec.get(key));
                    that.set(key, spec.get(key));
                });
                */
            }

            /*
            if (!is_defined(this.__id) && jsgui.__data_id_method == 'init') {
                if (this.context) {
                    //console.log('this.context ' + this.context);
                    //console.log('sfy this.context ' + stringify(this.context));

                    // Don't need an ID here.
                    //  I think.

                    //console.log('getting new id');
                    //this.__id = this.context.new_id(this.__type_name || this.__type);
                    //console.trace();
                    //console.log('DataObject new ID from context: ' + this.__id);
                    //this.context.map_objects[this.__id] = this;
                    // Not keeping a map of objects by id in the context.
                } else {

                }
            }
            */

            if (is_defined(spec.parent)) {
                //this.set('parent', spec.parent);
                this.parent = spec.parent;
            }

            if (this.context) {
                this.init_default_events();
            }

            //this._initializing = false;
        }
        //console.log('end Data_Object init');
    }



    'set_fields_from_spec'(fields, spec) {

        // Definitely looks like it's worth depricating this, and using a more advanced type of field, using the field function from
        //  lang-mini (new in late 2023 to lang-mini)

        // obext fields don't work like this.
        //   Should do more to support obext fields, powerful functionality that raises change events.

        // .field.on('change') ???

        // So model.background.color would be a field (somehow???)
        //   Make some advances on this level, and then integrate it into an app.

        console.trace();
        throw 'Deprecating in new Data_Object version for now.'






        //let that = this;
        each(fields, field => {
            if (typeof spec[field[0]] !== 'undefined') {
                this[field[0]] = spec[field[0]];
            } else {
                this[field[0]] = field[2];
            }

        })
    }

    'init_default_events'() {
        // May still / again make use of this with some controls.

    }

    /*
     'data_def': fp(function(a, sig) {
     if (sig == '[o]') {
     // create the new data_def constraint.


     }
     }),
     */

    'keys'() {
        return Object.keys(this._);
    }

    // fromJSON
    'toJSON'() {

        // Just the data inside it instead I think.
        //   Just data as JSON.

        var res = [];
        res.push('Data_Object(' + JSON.stringify(this._) + ')');
        return res.join('');
    }

    // using_fields_connection()
    //  will search up the object heirachy, to see if the Data_Objects fields need to be connected through the use of functions.
    //  that will make the fields easy to change by calling a function. Should make things much faster to access than when programming with Backbone.
    // then will connect the fields with connect_fields()


    /*
    'using_fields_connection'() {
        var res = false;
        iterate_ancestor_classes(this.constructor, function (a_class, stop) {
            if (is_defined(a_class._connect_fields)) {
                res = a_class._connect_fields;
                stop();
            }
        });
        return res;
    }
    */

    // using _relationships or whatever

    get parent() {
        return this._parent;
    }
    set parent(value) {
        return this._parent = value;
    }

    '_id'() {
        // gets the id.
        //console.log('Data_Object _id this.context ' + this.context);

        // Should get the context at an early stage if possible.
        //  Need to have it as the item is added, I think.
        if (this.__id) return this.__id;
        //if (!this.context) {
        //    if (this.parent.context) 
        //}

        if (this.context) {
            this.__id = this.context.new_id(this.__type_name || this.__type);
        } else {
            if (this._abstract) {
                return undefined;
            } else if (!is_defined(this.__id)) {

                // try the context of the parent.

                // What does not have the abstract?

                //var stack = new Error().stack;
                //console.log(stack);

                // no such function... but there should be something declared in many situations.
                //console.trace();
                //throw 'stop, currently unsupported.';
                //this.__id = new_data_object_id();

                //console.log('!!! no context __id ' + this.__id);
                return undefined;
            }
        }
        return this.__id;
    }

    // Problems with name (fields).
    //  Fields are given as a description of the fields.
    //   Gets more complicated when we have a function to access the fields as well.
    //   What if we want to override that function?

    // Will call it field
    //  18/12/2016 - Getting rid of this confusion, will mostly remove / greatly simplify field functionality.
    //  Just need to know which fields any class has, keeping track of this will use some data structures like Sorted_KVS,
    //   but not much complex code within this part.

    // Not so sure what a field function will do right now.
    //  Does not seem like such an essential part of the API.
    //   Can just define the fields, then they act a bit differently.
    //   Have field handling in Data_Object.
    //   Collection would have the same field capabilities. Fields should not be so important anyway.



    // 18/12/2016 Will remove constraints, then make them much more functional.
    
    //  Go through the keys....

    'each'(callback) {
        each(this._, callback);
    }


    // could make this polymorphic so that it
    //   sibling_index I think.

    'position_within'(parent) {
        var p_id = parent._id();
        //console.log('p_id ' + p_id);
        //console.log('this._parents ' + stringify(this._parents));

        if (this._parents && is_defined(this._parents[p_id])) {
            var parent_rel_info = this._parents[p_id];
            //console.log('parent_rel_info ' + stringify(parent_rel_info));

            //var parents = this._parents;
            //if (parents) {
            //
            //}
            var pos_within = parent_rel_info[1];

            // It is indexed by position in parent through the parent.

            return pos_within;
        }
    }

    // Maybe just 'remove' function.
    //  This may be needed with multiple parents, which are not being used at the moment.

    // ???? late 2023

    'remove_from'(parent) {

        // parent.remove this....
        // this.parent = undefined;

        var p_id = parent._id();

        if (this._parents && is_defined(this._parents[p_id])) {

            var parent = this._parents[p_id][0];
            var pos_within = this._parents[p_id][1];

            // is the position within accurate?
            var item = parent._arr[pos_within];
            //console.log('item ' + stringify(item));


            //console.log('');
            //console.log('pos_within ' + pos_within);
            // Then remove the item in the collection (or Data_Object?) ....
            // and the actual parent?

            // can get control / dataobject / collection by its ID of course.
            parent.remove(pos_within);
            // Remove it by index.
            delete this._parents[p_id];
        }
    }

    //  
    // Maybe only do this with the fields anyway

    'load_from_spec'(spec, arr_item_names) {

        // Deprecate for the moment.
        //   Fields that auto-load from spec seem best.

        console.trace();
        throw 'Deprecated in new Data_Object version';

        // set_values_from_spec???

        //var that = this;
        each(arr_item_names, (v) => {
            var spec_item = spec[v];
            if (is_defined(spec_item)) {
                this.set(v, spec_item);
            }
        });
    }

    // They will be treated as values in many cases anyway.
    //  Will turn them to different types of object where possible.

    /*
    'value'() {
        var a = arguments; a.l = arguments.length; var sig = get_a_sig(a, 1);
        // could operate like both get and set, but does not return data_objects, returns the value itself.
        var name;
        //var res;
        if (sig === '[s]') {
            name = a[0];
            var possibly_dobj = this.get(name);
            //var t_obj = tof(possibly_dobj);

            if (possibly_dobj) {
                if (possibly_dobj.value && typeof possibly_dobj.value === 'function') {
                    return possibly_dobj.value();
                } else {
                    return possibly_dobj;
                }
            }
        }
    }
    */

    // Get could be greatly simplified as well.
    //  Input and output processing will be more streamlined in a functional way.

    // 19/12/2016 - Not using get or set nearly as much anyway.


    'get'() {
        var a = arguments;
        a.l = arguments.length;
        
        // More specific about typed processing?
        //   The functional types may be best, and have them use mfp as well.
        //     That relies on sigs.
        

        var sig = get_a_sig(a, 1);


        var do_typed_processing = false;

        // Not sure about this 'typed processing'.
        //  if (is_defined(this.__type_name) && this.__type_name !== 'data_object') do_typed_processing = true;

        if (do_typed_processing) {
            // should possibly have this assigned for controls...
            //var raw_input = a;
            //console.log('this.__type_name is defined: ' + this.__type_name);
            //var parsed_input_obj = jsgui.input_processors[this.__type_name](raw_input);
            if (a.l === 0) {
                var output_obj = jsgui.output_processors[this.__type_name](this._);
                return output_obj;
            } else {
                console.log('a', a);
                console.trace();
                throw 'not yet implemented';
            }
        } else {

            // Fields will be done more simply, look up the field by name from the fields skvs.
            //  Can directly use a Sorted_KVS rather than a Collection with indexing to get somet hings like
            //   collection indexing done.

            // Less signature checking. Make it monomorphic where possible.
            //  Just get the object whether or not is is considered a field.
            //   For the moment, don't look for data or anything in the ._ object.
            //   Getting rid of the ._ object for the moment.
            //    Could have a .private() or .p() function internally.
            //    For the moment, don't have any private fields.
            //  The _ object would be easily proxyable.
            //   a private() object could be proxyable too.

            // Get and set less important now anyway.
            //  Still useful in some cases probably.



            //var field_info, field_name, field_type_name;

            if (sig == '[s,f]') {

                // Not yet????
                //   Or use promises rather than support callbacks here?
                //   Or support callbacks on promises and obs?

                throw 'Asyncronous access not allowed on Data_Object get.';
                var res = this.get(a[0]);
                var callback = a[1];
                if (typeof res == 'function') {
                    res(callback);
                } else {
                    return res;
                }
                // could check if we had a function returned.
                //  then we execute that function
                //callback(null, res);
            } else if (sig == '[s]') {
                var res = ll_get(this, a[0]);
                return res;
            } else if (a.l === 0) {
                // need to get the values of all fields.
                //  Think they are now being held in the field collection, fc.
                return this._;
            }
        }
    }

    'ensure_data_value'(property_name, default_value) {
        if (this._abstract) return undefined;
        if (!property_name || typeof property_name !== 'string') throw 'property_name expected: string';
        if (property_name.indexOf('.') > -1 && property_name !== '.') throw 'ensure_data_value does not support dotted paths (yet)';

        const has_key = this._ && Object.prototype.hasOwnProperty.call(this._, property_name);
        const existing = has_key ? this._[property_name] : undefined;

        if (existing && existing.__data_value) return existing;

        const initial_value = has_key ? existing : default_value;
        const dv = new Data_Value({
            value: initial_value
        });
        this._[property_name] = dv;
        return dv;
    }

    // Or don't use / support get and set for the moment?
    //   Only use property / field access?
    //   Define property, with getter and setter, seems like a more cleanly defined system.

    // May see about making a new simplified implementation of this and running it through tests.
    //   Though the new Data_Value seems like the more appropriate way for the moment.

    // May look into seeing where Data_Value is used in the current system too.
    //   Could see about further incorportating its use (in places).

    //'set': fp(function(a, sig) {
    'set'() {

        // Using ll_set or something recursive would be good.
        //  Again, set function is much less important now that ES6 setters have arrived.

        // Want a simple API here. No or very little changing of data.


        // Make (more) monomorphic
        //  Can greatly simplify this too.

        var a = arguments;
        a.l = arguments.length;
        var sig = get_a_sig(a, 1);

        if (this._abstract) return false;

        var that = this,
            res;

        var input_processors = jsgui.input_processors;
        //if (this._module_jsgui) {
        //    input_processors = this._module_jsgui.input_processors;
        //} else {
        //    input_processors = this._get_input_processors();
        //}

        if (a.l === 2 || a.l === 3) {
            var property_name = a[0],
                value = a[1];
            var ta2 = tof(a[2]);
            //console.log('ta2', ta2);
            var silent = false;
            var source;
            if (ta2 == 'string' || ta2 == 'boolean') {
                silent = a[2];
            }
            if (ta2 == 'control') {
                source = a[2];
            }
            if (!this._initializing && this._map_read_only && this._map_read_only[property_name]) {
                throw 'Property "' + property_name + '" is read-only.';
            } else {
                var split_pn = property_name.split('.');

                if (split_pn.length > 1 && property_name != '.') {
                    //console.log('split_pn ' + stringify(split_pn));
                    var spn_first = split_pn[0];
                    var spn_arr_next = split_pn.slice(1);
                    var data_object_next = this.get(spn_first);
                    //console.log('data_object_next', data_object_next);
                    if (data_object_next) {
                        res = data_object_next.set(spn_arr_next.join('.'), value);
                        if (!silent) {
                            const bubbled_stored = this.get(property_name);
                            var e_change = {
                                'name': property_name,
                                // Back-compat: bubbled events historically provided the input value.
                                'value': value,
                                // MVVM-friendly additions:
                                'data_value': (bubbled_stored && bubbled_stored.__data_value) ? bubbled_stored : undefined,
                                'raw_value': (bubbled_stored && bubbled_stored.__data_value) ? bubbled_stored.value : ((bubbled_stored && typeof bubbled_stored.value === 'function') ? bubbled_stored.value() : value),
                                'bubbled': true
                            };
                            if (source) {
                                e_change.source = source;
                            }
                            this.raise_event('change', e_change);
                        }
                    } else {
                        throw ('No data object at this level.');
                    }
                } else {
                    var data_object_next = this.get(property_name);
                    //console.log('data_object_next', data_object_next);
                    const had_existing = is_defined(data_object_next) && data_object_next !== null;
                    const incoming_is_node = value && (value.__data_object || value.__data_value || value.__data_grid);
                    const existing_is_data_value = data_object_next && data_object_next.__data_value;
                    const existing_is_data_object = data_object_next && data_object_next.__data_object;
                    const incoming_t = tof(value);

                    let stored;

                    if (existing_is_data_value) {
                        data_object_next.set(value);
                        stored = data_object_next;
                        res = data_object_next;
                    } else if (existing_is_data_object && incoming_t === 'object' && value !== null && !incoming_is_node && incoming_t !== 'array') {
                        // Preserve nested Data_Object identity for MVVM bindings.
                        data_object_next.set(value);
                        stored = data_object_next;
                        res = data_object_next;
                    } else {
                        if (incoming_is_node) {
                            stored = value;
                        } else {
                            // Back-compat: only wrap when creating a new key (or when key is currently null/undefined).
                            // For existing js-native values, keep storing the raw value to avoid breaking callers that expect primitives.
                            if (!had_existing) {
                                stored = this.ensure_data_value(property_name);
                                stored.set(value);
                            } else {
                                stored = value;
                            }
                        }
                        this._[property_name] = stored;
                        res = stored;
                    }

                    if (!silent) {
                        var e_change = {
                            'name': property_name,
                            // Back-compat: historically sometimes emitted Data_Value (when creating) and sometimes raw JS value (when updating).
                            'value': (!had_existing) ? stored : ((stored && stored.__data_value) ? stored.value : ((stored && typeof stored.value === 'function') ? stored.value() : stored)),
                            // MVVM-friendly additions:
                            'data_value': (stored && stored.__data_value) ? stored : undefined,
                            'raw_value': (stored && stored.__data_value) ? stored.value : ((stored && typeof stored.value === 'function') ? stored.value() : stored)
                        };
                        if (source) {
                            e_change.source = source;
                        }
                        this.raise_event('change', e_change);
                    }

                    // Back-compat return values:
                    // - When creating a new key, historically returned the input value.
                    // - When updating, historically returned the stored object (or primitive).
                    return had_existing ? res : value;
                }
            }
        } else {
            // But maybe it should be a data_value, not a data_object.
            //console.log('3) else sig ' + sig);
            var value = a[0];
            var property_name = a[1];
            var input_processor = input_processors[this.__type_name];

            if (input_processor) {

                // Act differently if it has a field as well?

                var processed_input = input_processor(value);
                //console.log('processed_input', processed_input);
                value = processed_input;
                this._[property_name] = value;

                this.raise_event('change', {
                    'value': value
                });
                return value;


            } else {
                // Need to be on the lookout for that.


                // And for a Data_Object?
                //  Basically put it into place.

                if (sig === '[D]') {
                    //console.log('property_name ' + property_name);
                    this._[property_name] = value;
                    // Or just have 3 parameters?
                    this.raise_event('change', [property_name, value]);

                    // Raise a change event?
                    //  Or is set event OK?
                    return value;
                } else if (sig === '[o]') {
                    //console.log('setting with a provided object');

                    //var that = this;
                    // may need to be recursive.
                    res = {};
                    each(a[0], function (v, i) {
                        //console.log('i ' + i);
                        //console.log('v ' + stringify(v));

                        res[i] = that.set(i, v);
                        //that.raise_event('change', [i, v]);

                    });
                    return res;
                } else if (sig === '[c]') {
                    //this._[]
                    this._[property_name] = value;
                    this.raise_event('change', [property_name, value]);
                    //throw 'unsupported';
                    return value;
                }
            }
        }
    }

    'has'(property_name) {
        return is_defined(this.get(property_name));
    }
}

// Can be done just with a getter, no setter.

jsgui.map_classes = jsgui.map_classes || {};

// seems like an overlap with the new jsgui.fromObject function.
//  That will initially go in the Enhanced_Data_Object module, or jsgui-enh

const dobj = (obj, data_def) => {
    // could take a data_def?
    // Could use the enhanced data object if we patch backwards?
    //  So Enhanced_Data_Object could hopefully patch backwards in the code?

    //var tdd = tof(data_def);

    var cstr = Data_Object;
    //if (Enhanced_Data_Object) cstr = Enhanced_Data_Object;
    //console.log('Enhanced_Data_Object ' + Enhanced_Data_Object);

    var res;
    if (data_def) {
        res = new cstr({
            'data_def': data_def
        });
    } else {
        res = new cstr({});
    }

    var tobj = tof(obj);

    //console.log('obj ' + stringify(obj));
    if (tobj == 'object') {
        var res_set = res.set;
        each(obj, (v, i) => {
            //res.set(i, v);
            res_set.call(res, i, v);
        });
    }

    return res;
};


Data_Object.dobj = dobj;
Data_Object.Mini_Context = Mini_Context;
module.exports = Data_Object;