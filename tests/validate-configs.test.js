// File System -------------------------------------------------------------------------------------
const { readdir, readJson } = require("fs-extra");

// Paths -------------------------------------------------------------------------------------------
const { join } = require("path");
const { distDirPath } = require("../lib/utils/paths.js");

// JSON Validation ---------------------------------------------------------------------------------
const Ajv = require("ajv");
const JSONSchemaDraft4Definition = require("../node_modules/ajv/lib/refs/json-schema-draft-04.json");
const prettierConfigSchema = require("./prettier.schema.json"); // http://json.schemastore.org/prettierrc
const ajv = new Ajv({ meta: JSONSchemaDraft4Definition, schemaId: "auto", extendRefs: true });
const validate = ajv.compile(prettierConfigSchema);

expect.extend({
	toBeValidPrettierJson(valid, fileSubPath, errorMessage) {
		return {
			pass: valid,
			message: () => valid ?
						   "" :
						   `Invalid Prettier configs for ${fileSubPath}: ${errorMessage}`,
		};
	},
});


// ============================================================================================== \\
// =========================================== TESTS ============================================ \\

test("Configuration packages exist and are well formed", async () => {
	const configPackageDirs = await readdir(distDirPath);

	expect(configPackageDirs.length).toBeGreaterThan(0);

	const packages = await Promise.all(
		configPackageDirs.map(configPackageDir => readdir(join(distDirPath, configPackageDir))),
	);

	packages.forEach((packageFiles) => {
		expect(packageFiles.sort())
			.toEqual([
				".prettierignore",
				".prettierrc.json",
				"LICENSE",
				"README.md",
				"package.json",
				"scripts",
			]);
	});

	const scripts = await Promise.all(
		configPackageDirs.map(configPackageDir => readdir(join(distDirPath,
			configPackageDir,
			"scripts"))),
	);

	scripts.forEach((scriptFiles) => {
		expect(scriptFiles.sort())
			.toEqual([
				"install.js",
				"uninstall.js",
				"utils.js",
			]);
	});

});


test("Prettier config files are valid according to the Prettier JSON schema", async () => {
	const configPackageDirs = await readdir(distDirPath);

	const configs = await Promise.all(
		configPackageDirs.map(configPackageDir => readJson(
			join(distDirPath, configPackageDir, ".prettierrc.json")).then(config => ({
				config,
				path: join(configPackageDir, ".prettierrc.json"),
			}),
			),
		));

	configs.forEach(({ config, path }) => {
		const validation = validate(config);
		expect(validation).toBeValidPrettierJson(path, ajv.errorsText(validate.errors));
	});
});
