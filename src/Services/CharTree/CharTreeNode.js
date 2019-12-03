
var CharacterTreeNode = function(char) {
      var node = this;

      node._parent = null;
      node._children = {};
      node._char = char;
      node._path = '';

      node._actions = [];
};

CharacterTreeNode.prototype.getFullPath = function() {
    return this._path;
};

CharacterTreeNode.prototype.$destroy = function() {
    var node = this;

    // Remove child references to this Node.
    Object.keys(node._children).forEach(function(childKey) {
        node._children[childKey]._parent = null;
    });
    node._children = {};

    if (node._parent) {
        var parentNode = node._parent;
        delete parentNode._children[node._char];

        // Cascade the removal of Nodes up the tree
        //   until there is a node that contains children.
        if (!Object.keys(parentNode._children).length) {
            parentNode.$destroy();
        }
        node._parent = null;
    }
};

CharacterTreeNode.prototype.getChildNode = function(char) {
    var node = this;

    return node._children[char];
};
CharacterTreeNode.prototype.createChild = function(char) {
    var node = this;

    var childNode = new CharacterTreeNode(char);
    childNode._parent = node;
    childNode._path = node._path + char;
    node._children[char] = childNode;

    return childNode;
};

CharacterTreeNode.prototype.getActions = function() {
    return this._actions.slice(0);
};

CharacterTreeNode.prototype.addAction = function(action) {
    this._actions.push(action);
};
CharacterTreeNode.prototype.removeAction = function(action) {
    var node = this;

    var index = node._actions.indexOf(action);
    if (index !== -1) {
        node._actions.splice(index, 1);
        // Check if this is a leaf Node with no other actions=
        if (!node._actions.length && Object.keys(!node._children).length) {
            // No actions remain
            // No existing children
            //   Destroying this Node
            node.$destroy();
        }
        return true;
    }
    return false;
};

module.exports = CharacterTreeNode;
