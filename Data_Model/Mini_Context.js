

class Mini_Context {
    // Need quite a simple mechanism to get IDs for objects.
    // They will be typed objects/
    constructor(spec) {
        const map_typed_counts = Object.create(null);
        this.new_id = (str_type = 'item') => {
            const current = map_typed_counts[str_type] || 0;
            map_typed_counts[str_type] = current + 1;
            return `${str_type}_${current}`;
        };
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