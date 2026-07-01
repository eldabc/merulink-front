/**
 * Build all possible paths in a menu tree structure.
 * Returns an object where keys are stringified JSON paths and values are boolean (collapsed state).
 *
 * @param {Array|Object} node - The menu tree node to traverse
 * @param {Array} path - Current path in the tree (used for recursion)
 * @returns {Object} Object with all possible paths initialized to true (collapsed)
 */
export function buildAllPaths(node, path = []) {
  if (!node) return {};

  const entries = Array.isArray(node) ? node : Object.values(node).filter(Boolean);
  const paths = {};

  entries.forEach((child) => {
    const currentPath = [...path, child.id];
    const pathKey = JSON.stringify(currentPath);
    paths[pathKey] = true;

    if (child.children?.length) {
      Object.assign(paths, buildAllPaths(child.children, currentPath));
    }
  });

  return paths;
}
