// returns whether a node is a css env() function
export default (node) => node && node.type === 'function' && node.value === 'env';
