module.exports = function cleanMarkup(arg) {
	return typeof arg === 'string' ? arg.replace(/<\/?[^>]+(>|$)/g, '') : arg;
};
