const { join } = require("path");
const { readFileSync } = require("fs");

// HOST_PACKAGE_ROOT is set in the npm scripts, and retrieved through 'npm prefix'
exports.hostPackageJsonFile = join(process.env.INIT_CWD, "package.json");

exports.hostPackageJsonIndentation = readFileSync(exports.hostPackageJsonFile, "utf8")
	.split("\n")
	.find(line => line.match(/\s*"name":/))
	.match(/\s*/g)[0];

exports.ownPrettierignoreFile = join(__dirname, "..", ".prettierignore");
exports.hostPackagePrettierignoreFile = join(process.env.INIT_CWD, ".prettierignore");
