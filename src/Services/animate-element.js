
var bindOnce = require('./bind-once.js');

var convertToMS = function(str) {
    var duration = null;
    if (!duration) {
        var durInt = str.replace('ms', '');
        if (durInt != str) {
            // time is in milliseconds
            duration = (+durInt);
        }
    }
    if (!duration) {
        var durInt = str.replace('s', '');
        if (durInt != str) {
            // time is in seconds
            duration = (+durInt) * 1000;
        }
    }

    return duration;
}

var getLongestTime = function(timesStr) {
    if (typeof timesStr !== 'string') {
        return;
    }

    var times = timesStr.split(',');
    var maxTime = 0;
    times.forEach(function(timeStr) {
        var time = convertToMS(timeStr);
        if (time && !isNaN(time) && time > maxTime) {
            maxTime = time;
        }
    });

    return maxTime;
}

// window.getComputedStyle
// window.requestAnimationFrame

// styles.transitionDuration
// styles.animationDuration

var processTransition = function(element, fn) {
    var elemStyles = window.getComputedStyle(element);
    var transitionDurationMax = getLongestTime(elemStyles.transitionDuration);
    console.log('transition dur: ' + transitionDurationMax);
    if (transitionDurationMax) {
        var unbinder = bindOnce(element, 'transitionend', fn);
        setTimeout(unbinder, transitionDurationMax);
    } else {
        fn.apply(fn);
    }
}

var processAnimation = function(element, fn) {
    var elemStyles = window.getComputedStyle(element);
    var animationDurationMax = getLongestTime(elemStyles.animationDuration);
    console.log('animation dur: ' + animationDurationMax);
    if (animationDurationMax) {
        var unbinder = bindOnce(element, 'animationend', fn);
        setTimeout(unbinder, animationDurationMax);
    } else {
        fn.apply(fn);
    }
}

module.exports = animationElement = function(element, animationCss, fn) {
    var removeClass = function() {
        element.classList.remove(animationCss);
        fn.apply(fn)
    };

    element.classList.add(animationCss);

    // wait for animation to end
    processAnimation(element, function() {
        element.classList.add('animate-active');
        processTransition(element, function() {
            element.classList.remove('animate-active');
            element.classList.remove(animationCss);

            fn.apply(fn);
        });
    });

};

/*
Example

.myAni {
    width: 100%;
}

// Enter

.myAni.enter-ani.animate-active {
    width: 100%;
    transition: width 1.6s ease;
}

inspector-stylesheet:7
.myAni.enter-ani {
    width: 0%;
    overflow: hidden;
}

elem.style.display = ''
animationElement($0, 'enter-ani', function() {console.log('ani complete')})


// Exit

.myAni.exit-ani.animate-active {
    transition: width 1.6s ease;
    width: 0%;
}

var elem = $0
animationElement($0, 'exit-ani', function() {elem.style.display = 'none'})


*/
