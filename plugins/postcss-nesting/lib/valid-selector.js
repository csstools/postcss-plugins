// a valid selector is an ampersand followed by a non-word character or nothing
export default /&(?:[^\w-|]|$)/;

export const replaceable = /&/g;
