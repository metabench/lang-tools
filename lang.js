/*
    Should make lang-tools module.
    // Get lang_mini using that instead.
    //  And this will use lang-mini.
    //  Cut down on number of code references in some cases.
*/


const lang_mini = require('lang-mini');
const collective = require('./collective');

const {more_general_equals} = require('./Data_Model/new/tools');

lang_mini.equals = more_general_equals;

lang_mini.collective = collective;
lang_mini.collect = collective;

const Evented_Class = lang_mini.Evented_Class;
//var Evented_Class = require('./_evented-class');
// Could use lang-mini for this.
//  Keep the code consisten
//  lang-ext
//  lang-enh
//  flang

const B_Plus_Tree = require('./b-plus-tree/b-plus-tree');
const Collection = require('./Data_Model/new/Collection');
const Data_Object = require('./Data_Model/new/Data_Object');
const Data_Value = require('./Data_Model/new/Data_Value');
const Data_Model = require('./Data_Model/Data_Model');
const Immutable_Data_Value = require('././Data_Model/new/Immutable_Data_Value');
const Immutable_Data_Model = require('././Data_Model/new/Immutable_Data_Model');
const Doubly_Linked_List = require('./doubly-linked-list');

const Ordered_KVS = require('./ordered-kvs');
const Ordered_String_List = require('./ordered-string-list');
const Sorted_KVS = require('./sorted-kvs');

// util...

const util = require('./util');

// merge util into lang_mini?

lang_mini.util = util;

lang_mini.B_Plus_Tree = B_Plus_Tree;
lang_mini.Collection = Collection;
lang_mini.Data_Object = Data_Object;
lang_mini.Data_Value = Data_Value;
lang_mini.Immutable_Data_Model = Immutable_Data_Model;
lang_mini.Immutable_Data_Value = Immutable_Data_Value;
lang_mini.Data_Model = Data_Model;
lang_mini.Doubly_Linked_List = Doubly_Linked_List;
//lang_mini.Evented_Class = Evented_Class;
lang_mini.Ordered_KVS = Ordered_KVS;
lang_mini.Ordered_String_List = Ordered_String_List;
lang_mini.Sorted_KVS = Sorted_KVS;
// remake it as an ec

const ec = new Evented_Class();
Object.assign(ec, lang_mini);

// Nothing here particularly about Resources.
//  Some resources may need to access the internet.
//   Less clearly lang specific?

// Or a data-transformer / transformer
//  compiler being a subset of transformer.
//  codec also being a subset of transformer.





// a compile command too, for command line usage.


// lang_mini.compilers.load('babel', babel.transform) ???
//  but will need to be able to send options through to compilers too.
//  Could have named option sets, easier shorthands.






module.exports = ec;
