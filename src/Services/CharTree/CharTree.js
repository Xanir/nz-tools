
import CharTreeNode from './CharTreeNode'

var CharacterTree = function() {
      var tree = this;

      tree._rootNode = new CharTreeNode();

      // Remove with no-op so the cascading branch removal
      //   leaves the root node intact.
      tree._rootNode.$destroy = function() {};
};

CharacterTree.prototype.findClosestMatch = function(str) {
    var tree = this;

    var currentNode = null;
    if (typeof str === 'string') {
        currentNode = tree._rootNode;
        for (var i = 0; i < str.length; i++) {
            var char = str[i];

            var childNode = currentNode.getChildNode(char);
            if (!childNode) {
                return currentNode === tree._rootNode ? null : currentNode;
            }

            currentNode = childNode;
        }
    }

    return currentNode;
};
CharacterTree.prototype.findClosestNodeWithActions = function(str) {
    var tree = this;

    var matchNode = tree.findClosestMatch(str);
    while (matchNode) {
        if (matchNode._actions.length) {
            return matchNode;
        }

        matchNode = matchNode._parent;
    };

    return null;
};

CharacterTree.prototype.buildPath = function(str) {
    var tree = this;

    var currentNode = null;
    if (typeof str === 'string') {
        currentNode = tree._rootNode;
        for (var i = 0; i < str.length; i++) {
            var char = str[i];

            var childNode = currentNode.getChildNode(char);
            if (!childNode) {
                childNode = currentNode.createChild(char);
            }

            currentNode = childNode;
        }
    }

    return currentNode;
};
CharacterTree.prototype.addAction = function(str, action) {
    var tree = this;

    var node = tree.buildPath(str);
    node.addAction(action);
};
CharacterTree.prototype.removeAction = function(str, action) {
    var tree = this;

    var node = tree.findClosestMatch(str);
    if (node && node._path === str) {
        return node.removeAction(action);
    }
    return false;
};

var sortLongestStringsFirst = function(nodeA, nodeB) {
    var a = nodeA._path;
    var b = nodeB._path;

    if (a == b) return 0;
    if (a.indexOf(b) === 0) {return -1}
    if (b.indexOf(a) === 0) {return 1}
    if (a < b) {return -1}
    if (b < a) {return 1}
    return 0;
};

CharacterTree.prototype.getActionNodes = function(str, action) {
    var tree = this;

    var actionNodes = [];

    var processingLevel = [tree._rootNode];
    while (processingLevel.length) {
        var nextLevel = [];
        processingLevel.forEach(function(node) {
            if (node._actions.length) {
                actionNodes.push(node);
            }

            // Add child nodes to next processing level
            var childrenNodes = Object.keys(node._children).map(
                function(key) {
                      return node._children[key];
                }
            );
            nextLevel.push.apply(nextLevel, childrenNodes);
        });
        processingLevel = nextLevel;
    }

    return actionNodes.sort(sortLongestStringsFirst);
};

export default CharacterTree
