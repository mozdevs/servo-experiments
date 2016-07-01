// Persistent list store
var storage = require('node-persist');
storage.initSync();


module.exports = function(ns) {
    var items = storage.getItem(ns) || [];

    function update() {
        storage.setItem(ns, items);
    }

    return {
        add: function (item) {
            items.push(item);
            update();
        },
        clear: function (item) {
            items = [];
            update();
        },
        get: function() {
            return items;
        },
        filter: function(pred) {
            items = items.filter(pred);
            update();
        },
        size: function() {
            return items.length;
        },
        splice: items.splice.bind(items)
    }
}