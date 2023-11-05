var jsgui = require('lang-mini');
//var Evented_Class = require('./_evented-class');

const Data_Model = require('../Data_Model');

const {is_defined, input_processors} = jsgui;

// What type is the value???

class Data_Value extends Data_Model {

    constructor(spec) {
        super(spec);
        this.__data_value = true;
        console.log('new (2.0) Data_Value constructor');

        if (spec && spec.context) {
            this.context = spec.context;
        }
        if (spec) {
            //console.log('!* spec.value ' + spec.value);
            //console.log('spec ' + stringify(spec));
        }
        if (spec && is_defined(spec.value)) {
            this._ = spec.value;
        }
        this.__type = 'data_value';
        // this.__data_type = ...
        // this.__data_type_name = ... ?

        //this._bound_events = {};
        this._relationships = {};
    }
    // Get but with a format change?
    //   Get and validate???
    'get'() {
        //return this._val;
        return this._;
    }
    // get value and set value.
    /*
    'value'() {
        return this._;
    }
    */
    get value() {
        return this._;
    }
    set value(value) {

        // Running the input processor(s)....?

        if (this._ !== value) {
            const old = this._;
            this._ = value;
            raise('change', {
                name: 'value',
                old,
                value
            })
        }
        
        

        // Raise the change event.
    }


    'toObject'() {
        return this._;

    }

    // .value =
    //   Though .set could have more input, eg a format shifter????

    'set'(val) {
        //this._val = val;

        // This may also need to make use of input_processors

        var input_processor = input_processors[this.__type_name];

        if (input_processor) {
            val = input_processor(val);
        }
        var old_val = this._;
        //console.log('old_val', old_val);
        this._ = val;
        //console.log('val', val);
        this.raise('change', {
            'old': old_val,
            'value': val
        });
        return val;
    }


    'toString'() {
        //return stringify(this.get());
        // con
        //console.log('this._val ' + stringify(this._val));
        //throw 'stop';
        return this.get();
    }
    // Maybe a particular stringify function?
    'toJSON'() {
        var val = this.get();
        //var tval = tof(val);
        var tval = typeof val;
        if (tval == 'string') {
            return '"' + val + '"';
        } else {
            return val;
        }
    }

    // Need to copy / clone the ._ value

    'clone'() {
        var res = new Data_Value({
            'value': this._
        });
        return res;
    }

    // This is important to the running of jsgui3.

    '_id'() {
        if (this.__id) return this.__id;
        if (this.context) {
            //console.log('this.__type ' + this.__type);
            //throw 'stop';
            this.__id = this.context.new_id(this.__type_name || this.__type);
        } else {
            if (!is_defined(this.__id)) {
                throw 'DataValue should have context';
                this.__id = new_data_value_id();
            }
        }
        return this.__id;
    }


    'parent'() {
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

        /*

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

        */
    }
};

module.exports = Data_Value;
