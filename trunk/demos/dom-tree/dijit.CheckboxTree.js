/*
Thanks to lbonacina for a significant chunk of the code
http://www.dojoforum.com/2008/06/09/tree-checkbox-using-dojo
*/
dojo.provide("dijit.CheckboxTreeNode");

dojo.require("dijit.Tree");
dojo.require("dijit.form.CheckBox");

dojo.declare(
  "dijit.CheckboxTreeNode",
  [dijit._TreeNode],
{
  templateString: '<div class="dijitTreeNode" waiRole="presentation">' +
                    '<div dojoAttachPoint="rowNode" class="dijitTreeRow" waiRole="presentation" dojoAttachEvent="onmouseenter:_onMouseEnter, onmouseleave:_onMouseLeave">' +
                      '<img src="${_blankGif}" alt="" dojoAttachPoint="expandoNode" class="dijitTreeExpando" waiRole="presentation">' +
                      '<span dojoAttachPoint="expandoNodeText" class="dijitExpandoText" waiRole="presentation"></span>' +
                      '<span dojoAttachPoint="contentNode" class="dijitTreeContent" waiRole="presentation">' +
                        '<input type="checkbox" dojoType="dijit.form.CheckBox"/>' +
                        '<img src="${_blankGif}" alt="" dojoAttachPoint="iconNode" class="dijitTreeIcon" waiRole="presentation">' +
                        '<span dojoAttachPoint="labelNode" class="dijitTreeLabel" wairole="treeitem" tabindex="-1" waiState="selected-false" dojoAttachEvent="onfocus:_onNodeFocus"></span>' +
                      '</span>' +
                    '</div>' +
                    '<div dojoAttachPoint="containerNode" class="dijitTreeContainer" waiRole="presentation" style="display: none;">' +
                  '</div>' +
                '</div>',
  
  widgetsInTemplate: true,

  setChildItems: function(/* Object[] */ items){
    // summary:
    //    Sets the child items of this node, removing/adding nodes
    //    from current children to match specified items[] array.

    var tree = this.tree,
      model = tree.model;

    // Orphan all my existing children.
    // If items contains some of the same items as before then we will reattach them.
    // Don't call this.removeChild() because that will collapse the tree etc.
    this.getChildren().forEach(function(child){
      dijit._Container.prototype.removeChild.call(this, child);
    }, this);

    this.state = "LOADED";

    if(items && items.length > 0){
      this.isExpandable = true;

      // Create _TreeNode widget for each specified tree node, unless one already
      // exists and isn't being used (presumably it's from a DnD move and was recently
      // released
      dojo.forEach(items, function(item){
        var id = model.getIdentity(item),
          existingNode = tree._itemNodeMap[id],
          node = 
            ( existingNode && !existingNode.getParent() ) ?
            existingNode :
            this.tree._createTreeNode({
              item: item,
              tree: tree,
              isExpandable: model.mayHaveChildren(item),
              label: tree.getLabel(item)
            });
        this.addChild(node);
        // note: this won't work if there are two nodes for one item (multi-parented items); will be fixed later
        tree._itemNodeMap[id] = node;
        if(this.tree.persist){
          if(tree._openedItemIds[id]){
            tree._expandNode(node);
          }
        }
      }, this);

      // note that updateLayout() needs to be called on each child after
      // _all_ the children exist
      dojo.forEach(this.getChildren(), function(child, idx){
        child._updateLayout();
      });
    }else{
      this.isExpandable=false;
    }

    if(this._setExpando){
      // change expando to/from dot or + icon, as appropriate
      this._setExpando(false);
    }

    // On initial tree show, put focus on either the root node of the tree,
    // or the first child, if the root node is hidden
    if(this == tree.rootNode){
      var fc = this.tree.showRoot ? this : this.getChildren()[0],
        tabnode = fc ? fc.labelNode : this.domNode;
      tabnode.setAttribute("tabIndex", "0");
      tree.lastFocused = fc;
    }
  },
  
  _updateItemClasses: function(item){
    // summary: set appropriate CSS classes for icon and label dom node (used to allow for item updates to change respective CSS)
    var tree = this.tree, model = tree.model;
    if(tree._v10Compat && item === model.root){
      // For back-compat with 1.0, need to use null to specify root item (TODO: remove in 2.0)
      item = null;
    }
    this.iconNode.className = "dijitInline dijitTreeIcon " + tree.getIconClass(item, this.isExpanded);
    this.labelNode.className = "dijitTreeLabel " + tree.getLabelClass(item, this.isExpanded);
  },

  postCreate: function() {
		// set label, escaping special characters
		this.setLabelNode(this.label);

		// set expand icon for leaf
		this._setExpando();

		// set icon and label class based on item
		this._updateItemClasses(this.item);

		if(this.isExpandable){
			dijit.setWaiState(this.labelNode, "expanded", this.isExpanded);
		}

    // preload
    // get value from the store (JSON) of the property "checked" and set the checkbox
    this.setNodeCheckboxValue(this.tree.model.store.getValue(this.item, "checked"));

    // connetto alla onChange del checkbox la modifica del model sottostante all'albero
    // questa a sua volta genera una _onItemChange sull'albero che si preoccupa di
    // gestire la propagazione del check sul model a figli del nodo
    dojo.connect(this.getNodeCheckbox(), 'onChange', this,
    function() {
      this.tree.model.store.setValue(this.item, "checked", (this.getNodeCheckbox().getValue() == false) ? false: true);
    });
  },

  // ritorna il dijit.Checkbox nel nodo
  getNodeCheckbox: function() {
    return this._supportingWidgets[0];
  },

  setNodeCheckboxValue: function(value) {
    this.getNodeCheckbox().setAttribute('checked', value);
  },
  
  getCheckedNodesList: function(nodeArray) {
    if (this.getNodeCheckbox().isChecked())
    nodeArray.push(this.item.label);

    this.getChildren().forEach(getCheckedNodesList(nodeArray), this);
  }
});

dojo.provide("dijit.CheckboxTree");

dojo.declare(
  "dijit.CheckboxTree",
  [dijit.Tree],
{
  _createTreeNode: function(args){
    // summary:
    //    creates a TreeNode
    // description:
    //    Developers can override this method to define their own TreeNode class;
    //    However it will probably be removed in a future release in favor of a way
    //    of just specifying a widget for the label, rather than one that contains
    //    the children too.
    return new dijit.CheckboxTreeNode(args);
  },
  
  _onItemChange: function(item) {
    //summary: processes notification of a change to an item's scalar values like label
    var model = this.model,
      identity = model.getIdentity(item),
      node = this._itemNodeMap[identity];

    if(node){
      var newValue = this.model.store.getValue(item, "checked");
      node.setLabelNode(this.getLabel(item));
      node.setNodeCheckboxValue(newValue);
      node._updateItemClasses(item);
    }
  }
});

dojo.provide("dijit.tree.CheckboxForestStoreModel");

dojo.declare(
  "dijit.tree.CheckboxForestStoreModel",
  [dijit.tree.TreeStoreModel],
{
  onChange: function(item) {
    var currStore = this.store;
    var newValue = currStore.getValue(item, "checked");
    
    // propago la modifica sui figli
    this.getChildren(item, function(children) {
      dojo.forEach(children, function(child) {
        currStore.setValue(child, "checked", newValue);
      });
    });
  }
});