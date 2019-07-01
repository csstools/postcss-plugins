// returns whether a node is a css env() function
export default (node) => node && node.type === 'func' && node.name === 'env';
