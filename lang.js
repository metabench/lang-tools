/*
    Should make lang-tools module.
    // Get lang_mini using that instead.
    //  And this will use lang-mini.
    //  Cut down on number of code references in some cases.
*/


var lang_mini = require('lang-mini');
var Evented_Class = lang_mini.Evented_Class;
//var Evented_Class = require('./_evented-class');
// Could use lang-mini for this.
//  Keep the code consisten
//  lang-ext
//  lang-enh
//  flang

var B_Plus_Tree = require('./b-plus-tree/b-plus-tree');
var Collection = require('./collection');
var Data_Object = require('./data-object');
var Data_Value = require('./data-value');
var Doubly_Linked_List = require('./doubly-linked-list');

var Ordered_KVS = require('./ordered-kvs');
var Ordered_String_List = require('./ordered-string-list');
var Sorted_KVS = require('./sorted-kvs');

// util...

var util = require('./util');

// merge util into lang_mini?

lang_mini.util = util;

lang_mini.B_Plus_Tree = B_Plus_Tree;
lang_mini.Collection = Collection;
lang_mini.Data_Object = Data_Object;
lang_mini.Data_Value = Data_Value;
lang_mini.Doubly_Linked_List = Doubly_Linked_List;
//lang_mini.Evented_Class = Evented_Class;
lang_mini.Ordered_KVS = Ordered_KVS;
lang_mini.Ordered_String_List = Ordered_String_List;
lang_mini.Sorted_KVS = Sorted_KVS;
// remake it as an ec

let ec = new Evented_Class();
Object.assign(ec, lang_mini);

module.exports = ec;