

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
module.exports = Mini_Context;