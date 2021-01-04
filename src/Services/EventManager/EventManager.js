var EventManager = function() {
    var emitter = this;

    // Map of even names to list of event callbacks
  emitter.events = {};
};

/*
    Registerer a callback function for a specific event
 */
EventManager.prototype.on = function(name, fn) {
    var emitter = this;

    if (typeof name !== 'string') {
        throw 'event name must be a string';
    }

    var events = emitter.events[name];
    if (!events) {
        // Init the events for this event type
        events = [fn];
        emitter.events[name] = events;
    } else {
        if (events.indexOf(fn) === -1) {
            events.push(fn);
        }
    }
};

/*
    Removes a registered callback function for a specific event
 */
EventManager.prototype.off = function(name, fn) {
   var emitter = this;

    if (typeof name !== 'string') {
        throw 'event name must be a string';
    }

    var events = emitter.events[name];
    if (events) {
        var index = events.indexOf(fn);
        if (index !== -1) {
            events.splice(index, 1);
            if (!events.length) {
                delete emitter.events[name];
            }
        }
    }
};

/*
    Removes a registered callback function for a specific event
 */
EventManager.prototype.clear = function(name) {
   var emitter = this;

    if (typeof name !== 'string') {
        throw 'event name must be a string';
    }

    delete emitter.events[name];
};

/*
    Call all callback functions for the registered event.
    Passing any additional parameters after the eventName
      to the callback functions
 */
EventManager.prototype.emit = function(name) {
    var emitter = this;
    var args = Array.prototype.slice.call(arguments, 1);

    if (typeof name !== 'string') {
        throw 'event name must be a string';
    }

    // Get registered callbacks for the event name
    var events = emitter.events[name];
    if (events) {
        events.forEach(function(fn) {
            try {
                // Run the callback passing in the additional attributes
                fn.apply(fn, args);
            } catch (e) {
                console.error(e);
            }
        });
    }
};

module.exports = EventManager;
