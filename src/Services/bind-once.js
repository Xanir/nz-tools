
var bindSingleEvent = function(element, eventName, fn) {
    var onEvent = function() {
        element.removeEventListener(eventName, onEvent);
        fn.apply(fn);
    };
    element.addEventListener(eventName, onEvent);
}

module.exports = bindOnce = function(element, eventNames, fn) {
    var events = eventNames.split(/\s/);
    var hasRun = false;
    var unbinder = function () {
        events.forEach(function(eventName) {
            element.removeEventListener(eventName, unbinder);
        });
        if (!hasRun) {
            fn.apply(fn);
            hasRun = true;
        }
    };

    events.forEach(function(eventName) {
        bindSingleEvent(element, eventName, unbinder);
    });

    return unbinder;
};
