//enum
const COMPARISON = {
  EQUAL: 0,
  SMALLER: -1,
  GREATER: 1,
};

const defaultCompareNumberFn = (a, b) => {
  if (Number(a) == Number(b)) {
    return COMPARISON.EQUAL;
  }

  return Number(a) < Number(b) ? COMPARISON.SMALLER : COMPARISON.GREATER;
};

class TreeNode {
  constructor(value, parent) {
    this.value = value.toString();
    this.parent = parent || null;
    this.left = null;
    this.right = null;
  }

  get isLeaf() {
    return this.left === null && this.right === null;
  }

  get hasChildren() {
    return !this.isLeaf;
  }
}

class BinarySearchTree {
  root;
  compareFn;
  constructor(compareFn = defaultCompareNumberFn) {
    this.root = null;
    this.compareFn = compareFn;
  }

  insert(value) {
    let node = this.root;
    let insertedNode;
    
    if (node === null) {
      this.root = new TreeNode(value);
      return this.root;
    }

    const nodeInserted = (() => {
      while (true) {
        const comparison = this.compareFn(value, node.value);
        if (comparison === COMPARISON.EQUAL) {
          insertedNode = node;
          return node;
        }
        if (comparison === COMPARISON.SMALLER) {
          if (node.left === null) {
            insertedNode = new TreeNode(value, node);
            node.left = insertedNode;
            return true;
          }
          node = node.left;
        } else if (comparison === COMPARISON.GREATER) {
          if (node.right === null) {
            insertedNode = new TreeNode(value, node);
            node.right = insertedNode;
            return true;
          }
          node = node.right;
        }
      }
    })();
    if (nodeInserted) {
      return insertedNode;
    }
  }

  remove(value, node = this.root, parent = null) {
    if (node === null) return null;
  
    const comparison = this.compareFn(value, node.value);
    if (comparison === COMPARISON.SMALLER) {
      return this.remove(value, node.left, node);
    } else if (comparison === COMPARISON.GREATER) {
      return this.remove(value, node.right, node);
    } else {
      if (node.isLeaf) {
        if (parent === null) {
          this.root = null;
        } else if (parent.left === node) {
          parent.left = null;
        } else {
          parent.right = null;
        }
        return parent; 
      }

      //replace that node by its child
      if (node.left === null) {
        const temp = node.right;
        this.replaceNode(node, node.right);
        return temp;
      } else if (node.right === null) {
        const temp = node.left;
        this.replaceNode(node, node.left);
        return temp;
      }
  
      //2 children
      const minRightLeaf = this.min(node.right);
      node.value = minRightLeaf.value;
      node.right = this.remove(minRightLeaf.value, node.right, node);
    }
  
    return node;
  }
  
  replaceNode(node, replacement) {
    if (node.parent === null) {
      this.root = replacement;
    } else if (node.parent.left === node) {
      node.parent.left = replacement;
    } else {
      node.parent.right = replacement;
    }
    
    if (replacement !== null) {
      replacement.parent = node.parent;
    }
  }
  

  search(value) {
    let current = this.root;
  
    while (current) {
      const comparison = this.compareFn(value, current.value);
  
      if (comparison === COMPARISON.EQUAL) {
        return current;
      }
  
      if (comparison === COMPARISON.SMALLER) {
        current = current.left; 
      } else {
        current = current.right;
      }
    }
  
    return null;
  }
  
  

  min(node = this.root) {
    let current = node;
    while (current !== null && current.left !== null) {
      current = current.left;
    }
    return current;
  }

  max(node = this.root) {
    let current = node;
    while (current !== null && current.right !== null) {
      current = current.right;
    }
    return current;
  }
  
  inOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }

    if (node.left) {
      traversed.push(...this.inOrderTraverse(node.left));
    }

    traversed.push(node);
    
    if (node.right) {
      traversed.push(...this.inOrderTraverse(node.right));
    }
    
    return traversed;
  }

  preOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }
    traversed.push(node);
    if (node.left) {
      traversed.push(...this.preOrderTraverse(node.left));
    }
    if (node.right) {
      traversed.push(...this.preOrderTraverse(node.right));
    }
    return traversed;
  }
  
  postOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }
    if (node.left) {
      traversed.push(...this.postOrderTraverse(node.left));
    }
    if (node.right) {
      traversed.push(...this.postOrderTraverse(node.right));
    }
    traversed.push(node);
    return traversed;
  }
}

export default BinarySearchTree;