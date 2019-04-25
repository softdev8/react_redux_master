export function findTreeNode(root, nodeId) {
  if (root.id === nodeId) {
    return root;
  }
  else if (root.children) {
    for (let i = 0; i < root.children.length; i++) {
      const retNode = findTreeNode(root.children[i], nodeId);
      
      if (retNode) {
        return retNode;
      }
    }
  }

  return null;
}

export function parseTree(root, nodeId, callback, content) {
  if (root.id === nodeId && callback) {
    callback(root, content);
    return;
  }

  if (root.children) {
    for (let i = 0; i < root.children.length; i++) {
      parseTree(root.children[i], nodeId, callback, content);
    }
  }
}

export function deleteTreeNode(root, nodeId) {
  if (root.children) {
    for (let i = 0; i < root.children.length; i++) {
      const childNode = root.children[i];

      if(childNode.id === nodeId) {
        root.children.splice(i, 1);
        return;
      }

      deleteTreeNode(childNode, nodeId);
    }
  }
}

function flattenTreeRec(node, currPath, files) {
  if (node.leaf) {
    const filename = currPath + node.module;
    files[filename] = node.data.content;
  }
  else {
    for (let i = 0; i < node.children.length; i++) {

      let newPath = node.module + '/';
      if (currPath.length) {
        newPath = currPath + node.module + '/';
      }

      flattenTreeRec(node.children[i], newPath, files);
    }
  }
}

export function flattenTree(root) {
  const files = {};

  for (let i = 0; i < root.children.length; i++) {
    flattenTreeRec(root.children[i], "", files);
  }

  return files;
}
