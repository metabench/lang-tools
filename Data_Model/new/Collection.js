
var lang = require('lang-mini');
//var Data_Structures = require('./jsgui-data-structures');
var Data_Value = require('./Data_Value');
var Data_Object = require('./Data_Object');
var Sorted_KVS = require('../../sorted-kvs');
var dobj = Data_Object.dobj;
//console.log('Data_Object', Data_Object);
//var Data_Object_Field_Collection = Data_Object.Fields_Collection;
//var Constraint = require('./constraint');

var Constraint = Data_Object.Constraint;
var each = lang.each;
var tof = lang.tof;
var is_defined = lang.is_defined;
var stringify = lang.stringify;
var get_a_sig = lang.get_a_sig;
//var constraint_from_obj = Constraint.from_obj;
var native_constructor_tof = lang.native_constructor_tof;
var dop = Data_Object.prototype;

// Could definitely do with more work and testing.
//  Being sure of what its API is.
// .A fixed version of what it is now, consider and ask about improvements.

// May make a new version that's a copy of it, and make breaking changes to it.
//   Maybe also work on a ground-up implementation, and introduce parts of that into the new copy of Collection.

// May also want a Data_Object or Data_Value that holds or uses or represents a Typed_Array.
//   However, would not (be able to??) respond to changes in the value(s) in that typed aray.
//    Unless some trickery was done....
//    A wrapped Data_Model_Typed_Array could slow things down too much.

// At some points need to be OK with holding and sometimes changing raw values.
//   If you want to trigger the change notifications, use the higher level APIs.



// Want to enable silent updates.
//   So it does not raise events.



// .silent property.
//   would check for it before raising events.





class Collection extends Data_Object {
    constructor(spec = {}, arr_values) {
        super(spec);
        this.__type = 'collection';
        this.__type_name = 'collection';

        var t_spec = tof(spec);
        if (spec.abstract === true) {
            if (t_spec === 'function') {
                this.constraint(spec);
            }
        } else {

            // For the moment, mainly wraps the ._arr object.
            //   In newer version(s) may retain the ._arr property. Maybe not though.
            //     Perhaps this class would better use a proxy to provide access to multiple items in the array,
            //      and responding to them being changed?





            this._relationships = this._relationships || {};
            this._arr_idx = 0;
            this._arr = [];
            this.index = new Sorted_KVS();
            this.fn_index = spec.fn_index;

            if (t_spec === 'array') {
                spec = {
                    'load_array': spec
                };
            } else {
                if (t_spec === 'function') {
                    if (spec.abstract === true) {
                        //throw 'Collection with abstract spec function';
                        this._abstract = true;
                    } else {
                    }

                } else if (t_spec === 'string') {
                    var map_native_constructors = {
                        'array': Array,
                        'boolean': Boolean,
                        'number': Number,
                        'string': String,
                        'object': Object
                    }
                    var nc = map_native_constructors[spec];
                    if (nc) {
                        spec = {
                            'constraint': nc
                        };
                        if (nc == String) {
                            spec.index_by = 'value';
                        }
                    }
                }
            }
            if (is_defined(spec.items)) {
                spec.load_array = spec.load_array || spec.items;
            }
            if (arr_values) {
                //console.log('load arr_values ------------');
                spec.load_array = arr_values;
            }
            // keeping these things below the expected public interface.
            if (is_defined(spec.accepts)) {
                this._accepts = spec.accepts;
            }
            if (lang.__data_id_method === 'init') {
                // but maybe there will always be a context. May save download size on client too.
                if (this.context) {
                    this.__id = this.context.new_id(this.__type_name || this.__type);
                    this.context.map_objects[this.__id] = this;
                } else {
                    // don't think we want a whole bunch of objects mapped like this....
                    //  IDs will be very useful when they are controls... but maybe not always needed.

                    //this.__id = new_collection_id();
                    //map_jsgui_ids[this.__id] = this;
                }
            }
            if (!this.__type) {

            }
            if (spec.load_array) {
                this.load_array(spec.load_array);
            }
        }
    }
    // maybe use fp, and otherwise apply with the same params and context.
    'set' (value) {
        var tval = tof(value);
        if (tval === 'data_object' || tval === 'data_value') {
            this.clear();
            return this.push(value);
        } else if (tval === 'array') {
            // for an array... clear, then add each.
            this.clear();
            each(value, (v, i) => {
                this.push(v);
            });
        } else {
            if (tval === 'collection') {
                // need to reindex - though could have optimization that checks to see if the indexes are the same...
                throw 'stop';
                this.clear();
                value.each(function (v, i) {
                    that.push(v);
                });
            } else if (tval === 'string' || tval === 'number' || tval === 'boolean' || tval === 'null' || tval === 'undefined') {
                // Single primitive value: clear and push it
                this.clear();
                return this.push(value);
            } else {
                //console.log("_super:" + value);
                // Fixed <BUG004>: Use proper prototype chain instead of undefined this.super
                const Data_Object = require('./Data_Object');
                return Data_Object.prototype.set.call(this, value);
            }
        }
    }

    'clear' () {



        this._arr_idx = 0;
        this._arr = [];
        this.index.clear();
        // listner class hears the event but then loses access to its own this.

        // The future change clear event could have an immutable copy of this efore the change, and return it as the old value???

        // However, Collection (maybe?) would not even have .value.
        //   or .value could be the array like ._arr???
        //   and also provide a ._arr interface in the future.





        this.raise('change', {
            'name': 'clear'
        });
    }

    'stringify' () {
        var res = [];
        if (this._abstract) {
            // then we can hopefully get the datatype name
            // if it's abstract we detect it, otherwise it should be in there.
            var ncto = native_constructor_tof(this._type_constructor);
            res.push('~Collection(')
            if (ncto) {
                res.push(ncto);
            } else {

            }
            res.push(')');
        } else {
            res.push('Collection(');
            //console.log('obj._arr ' + stringify(obj._arr));
            var first = true;
            this.each(function (v, i) {
                if (!first) {
                    res.push(', ');
                } else {
                    first = false;
                }
                res.push(stringify(v));
            });
            res.push(')');
        }
        return res.join('');
    }

    'toString' () {
        return stringify(this._arr);
    }

    'toObject' () {
        var res = [];
        this.each(function (v, i) {
            res.push(v.toObject());
        });
        return res;
    }

    'each' () {
        var a = arguments;
        a.l = arguments.length;
        var sig = get_a_sig(a, 1);
        // was callback, context
        // ever given the context?

        if (sig == '[f]') {
            return each(this._arr, a[0]);
        } else {

            if (sig == '[X,f]') {
                // X for index

                // we use the order of the index.
                //  possibly we can iterate using the index itself, maybe with that same callback.

                var index = a[0];
                var callback = a[1];
                return index.each(callback);

            } else {
                if (a.l == 2) {
                    return each(this._arr, a[0], a[1]);
                }
            }
        }
    }

    '_id' () {
        // gets the id (a new one sometimes)
        if (this.context) {
            this.__id = this.context.new_id(this.__type_name || this.__type);
        } else {
            //if (!is_defined(this.__id)) {

                // get a temporary id from somewhere?
                //  but the collection should really have a context...
                //  or without a context, the collection is its own context?

                // Won't go setting the ID for the moment.

                //this.__id = new_collection_id();
            //}
        }
        return this.__id;
    }
    'length' () {
        return this._arr.length;
    }
    get len () {
        return this._arr.length
    }
    'find' () {
        var a = arguments;
        a.l = arguments.length;
        var sig = get_a_sig(a, 1);
        if (a.l == 1) {
            var pos = this.index.get(a[0])[0];
            //console.log('pos', pos);
            var item = this._arr[pos];
            return item;
            // if there is only one index in the system then the search will be simple.
        }
        if (sig == '[o,s]') {
            return this.index_system.find(a[0], a[1]);
        }
        // and if looking for more than one thing...
        if (sig == '[s,s]') {
            return this.index_system.find(a[0], a[1]);
        }
        if (sig == '[a,s]') {
            return this.index_system.find(a[0], a[1]);
        }
        if (sig == '[s,o]') {
            var propertyName = a[0];
            var query = a[1];
            var foundItems = [];
            // for each object we need to go deeper into the fields.
            each(this, (item, index) => {
                if (item.get) {
                    var itemProperty = item.get(propertyName);
                } else {
                    var itemProperty = item[propertyName];
                }
                var tip = tof(itemProperty);
                var tip2;
                var ip2;

                if (tip === 'data_value') {
                    var ip2 = itemProperty.value;
                    tip2 = tof(ip2);
                } else {
                    ip2 = itemProperty;
                    tip2 = tip;
                }
                if (tip2 === 'array') {
                    each(ip2, (v, i) => {
                        //console.log('v ' + stringify(v));
                        var matches = obj_matches_query_obj(v, query);
                        //console.log('matches ' + matches);
                        if (matches) {
                            foundItems.push(v);
                        }
                    })
                };
            });
            var res = new Collection(foundItems);
            return res;
        }
    }
    // get seems like the way to get unique values.

    'get' () {
        var a = arguments;
        a.l = arguments.length;
        var sig = get_a_sig(a, 1);
        if (sig == '[n]' || sig == '[i]') {
            return this._arr[a[0]];
        }
        if (sig == '[s]') {
            var ix_sys = this.index_system;
            var res;
            if (ix_sys) {
                //console.log('ix_sys', ix_sys);
                var pui = ix_sys._primary_unique_index;
                //console.log(pui);
                res = pui.get(a[0])[0];
            }
            if (res) {
                return res;
            }
            return Data_Object.prototype.get.apply(this, a);
        }
    }

    'insert' (item, pos) {
        this._arr.splice(pos, 0, item);
        this.raise('change', {
            'name': 'insert',
            'item': item,
            'value': item,
            'pos': pos
        });
    }
    swap(item, replacement) {
        let r_parent = replacement.parent;
        let repl_pos = replacement.parent.content.remove(replacement);
        let i_parent = item.parent;
        let item_pos = item.parent.content.remove(item);
        let item_index;
        i_parent.content.insert(replacement, item_pos);
        r_parent.content.insert(item, repl_pos);
    }

    // may have efficiencies for adding and removing multiple items at once.
    //  can be sorted for insertion into index with more rapid algorithmic time.

    'remove' () {
        // Make more monomorphic. ????2023????

        var a = arguments;
        a.l = arguments.length;
        var sig = get_a_sig(a, 1);
        //var that = this;

        //console.log('remove sig:', sig);

        if (sig === '[n]') {
            var pos = a[0];
            //console.log('pos - item index', pos);
            var item = this._arr[pos];
            //var o_item = item;
            var spliced_pos = pos;
            this._arr.splice(pos, 1);
            this._arr_idx--;
            //var length = this._arr.length;

            /*
            while (pos < length) {
                // reassign the stored position of the item
                var item = this._arr[pos];

                // Not so sure about 'relationships' here.
                //item.relationships[own_id] = [this, pos];

                pos++;
            }
            */


            var e = {
                'target': this,
                'value': item,
                'position': spliced_pos,
                'name': 'remove'
            }
            this.raise('change', e);

            return pos;
        } else if (sig === '[s]') {
            var key = a[0];
            var obj = this.index_system.find([
                ['value', key]
            ]);
            var my_id = this.__id;
            var item_pos_within_this = obj[0]._relationships[my_id];
            this._arr.splice(item_pos_within_this, 1);
            for (var c = item_pos_within_this, l = this._arr.length; c < l; c++) {
                //console.log('c ' + c);
                var item = this._arr[c];
                item._relationships[my_id]--;
            }
            var e = {
                'target': this,
                'value': obj[0],
                'position': item_pos_within_this,
                'name': 'remove'
            }
            this.raise('change', e);
        } else {
            let item_index;
            // or swap the item itself
            const item = a[0];

            //

            let arr = this._arr,
                l = arr.length;
            if (typeof item === 'number') {
                item_index = item;
            } else {
                let found = false,
                    c = 0;


                while (!found && c < l) {
                    found = arr[c] === item;

                    if (found) {
                        item_index = c;
                    }


                    c++;
                }
                //if (found) {
                //}

                if (is_defined(item_index)) {
                    return this.remove(item_index);
                }
            }
        }
    }

    'has' (obj_key) {
        // This part needs (temp?) fixing...

        //console.log('obj_key', obj_key);

        if (this.get_index(obj_key) === undefined) {
            return false;
        } else {
            return true;
        }

        //console.trace();
        //throw 'NYI';
    }
    'get_index' () {
        // Make (more) monomorphic, have it consult the sorted KVS.
        var a = arguments;
        a.l = arguments.length;
        var sig = get_a_sig(a, 1);
        if (sig === '[s]') {

            if (this.index_system) {

                return this.index_system.search(a[0]);



            } else {
                //console.log('a[0]', a[0]);

                // Could search by name...?

                //console.log('this._arr', this._arr);

                if (this._arr.length === 0) {
                    return undefined;
                } else {

                    // go through the objects in the array.
                    //   check against 'name' properties...

                    for (let c = 0; c < this._arr.length; c++) {
                        const item = this._arr[c];



                        if (item?.name === a[0]) {
                            return c;
                        }

                    }

                    return undefined;

                    //console.trace();
                    //throw 'stop';
                }


            }


        } else {
            console.trace();
            throw 'Expected [s]';
        }
    }

    // More fp way of indexing.
    'index_by' () {
        var a = arguments;
        a.l = arguments.length;
        var sig = get_a_sig(a, 1);

        console.log('Indexing not implemented (like this)');
        console.trace();
    }

    'push' (value) {

        const {silent} = this;



        let tv = tof(value);
        let fn_index = this.fn_index;
        let idx_key, has_idx_key = false,
            pos;
        if (fn_index) {
            idx_key = fn_index(value);
            has_idx_key = true;
        }
        if (tv === 'object' || tv === 'function') {
            // Long comments removed. Use functional constraint satisfaction if we have that.
            pos = this._arr.length;
            this._arr.push(value);
            //console.log('pushing value', value);
            //this.index_system.unsafe_add_object(value);
            this._arr_idx++;


            if (!silent) {
                const e = {
                    'target': this,
                    'item': value,
                    'value': value,
                    'position': pos,
                    'name': 'insert'
                }
                this.raise('change', e);
            }


        } else if (tv === 'data_value') {
            pos = this._arr.length;
            this._arr.push(value);
            this._arr_idx++;
            if (!silent) {
                const e = {
                    'target': this,
                    'item': value,
                    'value': value,
                    'position': pos,
                    'name': 'insert'
                }
                this.raise('change', e);
            }
        } else if (tv === 'collection') {
            pos = this._arr.length;
            this._arr.push(value);
            this._arr_idx++;

            if (!silent) {
                const e = {
                    'target': this,
                    'item': value,
                    'value': value,
                    'position': pos,
                    'name': 'insert'
                }
                this.raise('change', e);
            }

        } else if (tv === 'data_object' || tv === 'control') {
            pos = this._arr.length;
            // Should not need a context or ID just to be put in place.
            this._arr.push(value);
            this._arr_idx++;
            if (!silent) {
                const e = {
                    'target': this,
                    'item': value,
                    'value': value,
                    'position': pos,
                    'name': 'insert'
                }
                this.raise('change', e);
            }
        } else if (tv === 'array') {
            const new_coll = new Collection(value);
            pos = this._arr.length;
            // Should not need a context or ID just to be put in place.
            this._arr.push(new_coll);
            if (!silent) {
                const e = {
                    'target': this,
                    'item': value,
                    'value': value,
                    'position': pos,
                    'name': 'insert'
                }
                this.raise('change', e);
            }
        }

        // Fixed <BUG003>: Handle boolean, null, undefined by wrapping in Data_Value
        if (tv === 'string' || tv === 'number' || tv === 'boolean' || tv === 'null' || tv === 'undefined') {
            // Not so sure about this now.
            const dv = new Data_Value({
                'value': value
            });
            pos = this._arr.length;
            // Should not need a context or ID just to be put in place.
            this._arr.push(dv);
            if (!silent) {
                const e = {
                    'target': this,
                    'item': value,
                    'value': value,
                    'position': pos,
                    'name': 'insert'
                }
                this.raise('change', e);
            }
        }
        if (has_idx_key) {
            this.index.put(idx_key, pos);
        }
        //this._arr_idx++;
        return value;
    }

    'load_array' (arr) {
        for (var c = 0, l = arr.length; c < l; c++) {
            this.push(arr[c]);
        }
        this.raise('load');
    }
    'values' () {
        var a = arguments;
        a.l = a.length;
        //var sig = get_a_sig(a, 1);
        if (a.l === 0) {
            return this._arr;
        } else {
            var stack = new Error().stack;
            throw 'not yet implemented';
        }
    }
    'value' () {
        const res = [];
        this.each((v, i) => {
            if (v && typeof v.value !== 'undefined') {
                // New Data_Value uses .value property
                res.push(v.value);
            } else {
                res.push(v);
            }
        });
        return res;
    }
};

var p = Collection.prototype;
p.add = p.push;
module.exports = Collection;
