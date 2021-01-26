const { join } = require("path");

const root = join(__dirname, "..", "..");
const libDirPath = join(root, "lib");
const templatesDirPath = join(root, "templates");


module.exports = {
	configsDirPath: join(libDirPath, "configs"),
	distDirPath: join(root, "dist"),
	tmpDirPath: join(root, "tmp"),
	libDirPath,
	templatesDirPath,
	packageJsonTemplateFilePath: join(templatesDirPath, "package.json"),
	readmeTemplateFilePath: join(templatesDirPath, "README.md"),
	editorconfigPrettierrcTemplateFilePath: join(
		templatesDirPath,
		"configs",
		"editorconfig-prettierrc.js"
	),
};
