/**
 * Build all possible paths in a menu tree structure.
 * Returns an object where keys are stringified JSON paths and values are boolean (collapsed state).
 * 
 * @param {Object} node - The menu tree node to traverse
 * @param {Array} path - Current path in the tree (used for recursion)
 * @returns {Object} Object with all possible paths initialized to true (collapsed)
 */
export function buildAllPaths(node, path = []) {
  const paths = {};
  Object.keys(node)
    .filter(key => key !== "_meta")
    .forEach(key => {
      const child = node[key];
      const currentPath = [...path, key];
      const pathKey = JSON.stringify(currentPath);
      paths[pathKey] = true; // true = collapsed
      
      const hasChildren = Object.keys(child).some(k => k !== "_meta");
      if (hasChildren) {
        Object.assign(paths, buildAllPaths(child, currentPath));
      }
    });
  return paths;
}
