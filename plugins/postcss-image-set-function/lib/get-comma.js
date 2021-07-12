// return whether a node is a valid comma
module.exports = node => Object(node).type === 'punctuation' && Object(node).value === ',';
