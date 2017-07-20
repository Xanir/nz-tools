

var Services = require('../Services/Services.js');

var convertTextPositioningToNumeric = function(positioningText) {
	switch(positioningText) {
		case 'center':
			return 0;
		case 'left':
			return -1;
		case 'right':
			return 1;
		case 'top':
			return 1;
		case 'bottom':
			return -1;
		default:
			return +positioningText;
	}
};

var getLeftPos = function(baseElemPos, baseElemOffset, anchorElemPos, anchorElemPosOffset) {
	var elemLeft = 0;

	var anchorCenter = anchorElemPos.left + (anchorElemPos.width / 2);

	var anchorElemPivot = (anchorElemPos.width / 2) * (anchorElemPosOffset);
	var baseElemPivot = (baseElemPos.width / 2) * (baseElemOffset);

	elemLeft = anchorCenter - (baseElemPos.width / 2) + anchorElemPivot - baseElemPivot;

	return elemLeft;
};

var getTopPos = function(baseElemPos, baseElemOffset, anchorElemPos, anchorElemPosOffset) {
	var elemTop = 0;

	var anchorCenter = anchorElemPos.top + (anchorElemPos.height / 2);

	var anchorElemPivot = (anchorElemPos.height / 2) * (anchorElemPosOffset);
	var baseElemPivot = (baseElemPos.height / 2) * (baseElemOffset);

	elemTop = anchorCenter - (baseElemPos.height / 2) - anchorElemPivot + baseElemPivot;

	return elemTop;
};

var positionFlyout = function(baseElement, baseElementOffset, alignToElement, alignToElementOffset) {
	var baseElementPos    = Services.getBoxData(baseElement);
	var alignToElementPos = Services.getBoxData(alignToElement);

	var elemLeft = getLeftPos(baseElementPos, baseElementOffset.x, alignToElementPos, alignToElementOffset.x);
	var elemTop =  getTopPos (baseElementPos, baseElementOffset.y, alignToElementPos, alignToElementOffset.y);

	window.requestAnimationFrame(function() {
		baseElement.style.left = elemLeft;
		baseElement.style.top = elemTop;
		baseElement.style.visibility = 'visible';
	});

};

module.exports = positionFlyout;
