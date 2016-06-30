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
            items.push();
            update();
        },
        clear: function (item) {
            items = [];
            update();
        },
        get: function() {
            return items;
        }
    }
}