
var EventManager = require('../EventManager/EventManager');

var PushStateManager = function() {
  	var manager = this;

  	var currentStateId = window.history.state ? window.history.state._historyId || null;
    if (!currentStateId) {
        currentStateId = new Date().getTime();
        window.history.state._historyId = currentStateId;
  		  window.history.replaceState(window.history.state, '', window.location.href);
    }
  	var historyIds = [currentStateId];

  	var eventManager = new EventManager();

  	manager.addListener = function(fn) {
  		  eventManager.on('change', fn);
  	};
  	manager.removeListener = function(fn) {
  		  eventManager.off('change', fn);
  	};

  	var invokeChangeListeners = function() {
  		  eventManager.emit('change', arguments);
  	};

  	var originalAction = {
    		pushState: window.history.pushState.bind(window.history),
    		replaceState: window.history.replaceState.bind(window.history),
  	};

  	window.history.pushState = function(stateObj) {
        var currentStateIndex = historyIds.indexOf(currentStateId);
        if (currentStateIndex !== historyIds.length - 1) {
            // Not last history index so we need to purge
            //   the irrelivent old history
            historyIds.splice(currentStateIndex + 1, historyIds.length);
        }

    		var newArgs = [];
    		newArgs.push.apply(newArgs, arguments);

    		if (!stateObj) {
      			stateObj = {};
      			newArgs[0] = stateObj;
    		}

    		if (!stateObj._historyId) {
    			   stateObj._historyId = new Date().getTime();
    		}

    		currentStateId = stateObj._historyId;
    		originalAction.pushState.apply(this, newArgs);
    		historyIds.push(currentStateId);

    		invokeChangeListeners(1);
  	};

  	window.history.replaceState = function(stateObj) {
        var currentStateIndex = historyIds.indexOf(currentStateId);
    		var newArgs = [];
    		newArgs.push.apply(newArgs, arguments);

    		if (!stateObj) {
    			stateObj = {};
    			newArgs[0] = stateObj;
    		}

    		if (!stateObj._historyId) {
    			   stateObj._historyId = new Date().getTime();
    		}
        historyIds[currentStateIndex] = stateObj._historyId;

    		historyIndex = history.indexOf(currentState);
    		if (historyIndex !== -1) {
    			   history.splice(historyIndex, 1, stateObj);
    		}

    		currentState = stateObj;
    		originalAction.replaceState.apply(this, newArgs);
  	};

  	window.addEventListener('popstate', function() {
    		var oldState = currentState;
    		currentState = window.history.state;

    		oldHistoryIndex = history.indexOf(oldState);
    		newHistoryIndex = history.indexOf(currentState);

    		invokeChangeListeners(newHistoryIndex - oldHistoryIndex);
  	});

};

module.exports = EventManager;
