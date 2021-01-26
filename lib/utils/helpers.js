const { copy } = require("fs-extra");
const { join } = require("path");

module.exports.fromTemplate = (template, map) => {
	return Array.from(map.entries()).reduce((instance, [placeholder, replacement]) => {
		return instance.replace(new RegExp(String.raw`{{${placeholder}}}`, "g"), replacement);
	}, template);
};

module.exports.copyList = (list, source, destination) => {
	return Promise.all(
		list.map(subPath => copy(
			join(source, subPath),
			join(destination, subPath),
		)),
	);
};
