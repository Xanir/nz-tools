
var regForUpdates = function(obj) {
    var objProps = {};
    var storeDebounce = null;
    var createGetWrapper = function(objKey) {
        return function() {
            var val = objProps[objKey];
            if (!val) {
                val = obj.constructor.prototype[objKey]
            }
            return val;
        };
    };
    var createSetWrapper = function(objKey) {
        return function(val) {
            clearTimeout(storeDebounce);
            if (val === null || val === undefined) {
                delete objProps[objKey];
            } else {
                objProps[objKey] = val;
            }
            storeDebounce = setTimeout(function() {
                localStorage['stateful-'+obj.id] = JSON.stringify(objProps);
            }, 10);
        };
    };
    console.log(obj.constructor.name);
    for (var objKey in obj) {
        var objVal = obj[objKey];
        if (typeof objVal !== 'object') {
            objProps[objKey] = objVal;
            Object.defineProperty(obj, objKey, {
                configurable: false,
                enumerable: true,
                get: createGetWrapper(objKey),
                set: createSetWrapper(objKey)
            })
        } else if (!(objVal instanceof Storable)) {
            throw 'you bad!';
        }
    }
}

var Storable = function StorableObj() {
    console.log('super invoked')
    regForUpdates(this);
};

Object.defineProperty(Storable.prototype, 'toString', {
    configurable: false,
    enumerable: false,
    value: function() {
        return JSON.stringify(this);
    }
});


var extendClass = function(obj, parentObj) {
    Object.defineProperty(obj, 'prototype', {
        configurable: false,
        enumerable: false,
        value: Object.create(parentObj.prototype)
    });

    Object.defineProperty(obj.prototype, 'constructor', {
        configurable: false,
        enumerable: false,
        value: obj
    });

    Object.defineProperty(obj, 'super', {
        configurable: false,
        enumerable: false,
        value: parentObj
    });
}

var getPrefixedKeys = function(prefix, obj) {
    return Object.keys(obj).filter(function(objKey) {
        return objKey.indexOf(prefix) === 0;
    });
}
