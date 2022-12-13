var jsgui = require('lang-mini');


// 2022 - Looks like it could be modified into being Model, or part of one.


//var Evented_Class = require('./_evented-class');
//var Data_Structures = require('./jsgui-data-structures');
var Data_Value = require('./data-value');
//var Constraint = require('./constraint');
//var Fields_Collection = require('./fields-collection');
//var Collection = require('jsgui2-collection');
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

// do data objects get an ID when they are initialized.
jsgui.__data_id_method = 'init';


// Seems worthwhile to get rid of constraint matching and fields.
//  Constraint matching will be added back in using a more functional system.
//  Indexing should be put down to a simple process that calls some simple functions.
//   It has got way too complicated so far. We need to map between an object (reading specific properties) and an array value.
//    The lists of keys for these items will be stored within a sorted structure.



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
var Ordered_String_List = require('./ordered-string-list');

class Mini_Context {
    // Need quite a simple mechanism to get IDs for objects.
    // They will be typed objects/
    constructor(spec) {
        var map_typed_counts = {};
        var typed_id = function (str_type) {
            throw 'stop Mini_Context typed id';
            var res;
            if (!map_typed_counts[str_type]) {
                res = str_type + '_0';
                map_typed_counts[str_type] = 1;
            } else {
                res = str_type + '_' + map_typed_counts[str_type];
                map_typed_counts[str_type]++;
            }
            return res;
        };
        this.new_id = typed_id;
        //new_id
    }
    'make'(abstract_object) {
        if (abstract_object._abstract) {
            //var res = new
            // we need the constructor function.
            var constructor = abstract_object.constructor;
            //console.log('constructor ' + constructor);
            //throw 'stop';
            var aos = abstract_object._spec;
            // could use 'delete?'
            aos.abstract = null;
            //aos._abstract = null;
            aos.context = this;
            var res = new constructor(aos);
            return res;
        } else {
            throw 'Object must be abstract, having ._abstract == true';
        }
    }
}

var is_js_native = function (obj) {
    var t = tof(obj);
    return t == 'number' || t == 'string' || t == 'boolean' || t == 'array';
};

class Data_Object extends Evented_Class {
    constructor(spec = {}, fields) {
        //console.log('1* spec.__type_name', spec.__type_name);
        super(spec);
        if (spec.id) {
			this.__id = spec.id;
		}
		if (spec.__id) {
			this.__id = spec.__id;
		}
        this.__type_name = spec.__type_name || 'data_object';

        this.set_fields_from_spec(fields, spec);

        this.__data_object = true;
        //if (!spec) spec = {};
        // if it's abstract call the abstract_init.

        //console.log('1** spec', spec);

        if (spec.abstract === true) {
            this._abstract = true;
            var tSpec = tof(spec);

            if (tSpec == 'function') {
                this._type_constructor = spec;
                // could possibly
                // but maybe want to keep this json-friendly.

                // the type constructor could be used in a collection.
                //  could be more leightweight than other things? specific constraint objects.
            }
            // Abstract controls won't be dealing with events for the moment.
            if (tSpec == 'object') {
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
            }
            if (t_spec == 'data_object') {
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
        let that = this;
        each(fields, field => {
            if (typeof spec[field[0]] !== 'undefined') {
                that[field[0]] = spec[field[0]];
            } else {
                that[field[0]] = field[2];
            }


        })
    }

    'init_default_events'() {


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

    'toJSON'() {
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
    

    'each'(callback) {
        each(this._, callback);
    }


    // could make this polymorphic so that it
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

    'remove_from'(parent) {
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
        var that = this;
        each(arr_item_names, function (v, i) {
            var spec_item = spec[v];
            if (is_defined(spec_item)) {
                that.set(v, spec_item);
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
            }
            // check to see if there is a field defined.

            if (sig == '[s]') {
                var res = ll_get(this, a[0]);
                return res;
            } else if (a.l === 0) {
                // need to get the values of all fields.
                //  Think they are now being held in the field collection, fc.
                return this._;
            }
        }
    }

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

        if (a.l == 2 || a.l == 3) {
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
                            var e_change = {
                                'name': property_name,
                                'value': value,
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
                    if (data_object_next) {
                        //console.log('property_name', property_name);
                        //var field = this.field(property_name);
                        var field = this[property_name];
                        //console.log('field', field);
                        if (field) {

                            data_object_next.__type_name = field[1] || data_object_next.__type_name;
                        }
                        //console.log('property_name', property_name);
                        //console.log('value', value);
                        data_object_next.set(value);
                        //console.log('3) data_object_next', data_object_next);
                    }
                    if (!is_defined(data_object_next)) {
                        var tv = typeof value;
                        var dv;
                        //console.log('property_name', property_name);
                        //console.log('tv ' + tv);
                        // And for an array?
                        if (tv === 'string' || tv === 'number' || tv === 'boolean' || tv === 'date') {
                            dv = new Data_Value({
                                'value': value
                            });
                        } else {
                            // And could make an array into a collection.
                            //  That seems like the most logical internal way of doing things.
                            //  An option to have them as arrays would make sense for performance (or typed arrays),
                            //   but a Collection makes the most sense logically.

                            if (tv === 'array') {
                                dv = new Data_Value({
                                    'value': value
                                });
                            } else {
                                if (tv === 'object') {
                                    if (value.__data_object || value.__data_value || value.__data_grid) {
                                        dv = value;
                                    } else {
                                        dv = new Data_Value({
                                            'value': value
                                        });
                                    }
                                } else {
                                    //console.log('tv', tv);
                                    dv = value;
                                }
                                //dv = value;
                            }
                        }
                        //this._[property_name] = dv;
                        this[property_name] = dv;

                        if (!silent) {
                            e_change = {
                                'name': property_name,
                                'value': dv
                            };
                            if (source) {
                                e_change.source = source;
                            }
                            this.raise_event('change', e_change);
                        }
                        return value;
                    } else {
                        var next_is_js_native = is_js_native(data_object_next);
                        if (next_is_js_native) {
                            //console.log('is_js_native');
                            //this.set
                            // but maybe that object should be wrapped in Data_Object?
                            //this._[property_name] = value;
                            this[property_name] = value;
                            res = value;
                        } else {
                            //console.log('not is_js_native');
                            //var res = data_object_next.set(value);
                            res = data_object_next;
                            //this._[property_name] = data_object_next;
                            this[property_name] = data_object_next;
                        }


                        if (!silent) {
                            var e_change = {
                                'name': property_name,
                                'value': data_object_next.value()
                            };
                            if (source) {
                                e_change.source = source;
                            }
                            this.trigger('change', e_change);
                        }
                        // want to listen to the set event for some things such as GUI components in particular.

                        return res;
                    }
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
                }

                if (sig === '[o]') {
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
                }

                // C for collection?
                if (sig === '[c]') {
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

var dobj = (obj, data_def) => {
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