// ========================================== IMPORTS =========================================== \\
// Core --------------------------------------------------------------------------------------------
const { join, basename } = require("path");
const { promisify } = require("util");
const execFile = promisify(require("child_process").execFile);
// Third Party -------------------------------------------------------------------------------------
const { mkdir, copy, writeFile, readFile, emptyDir, readdir } = require("fs-extra");
// Local -------------------------------------------------------------------------------------------
const { fromTemplate, copyList } = require("../utils/helpers.js");
const {
	configsDirPath,
	distDirPath,
	tmpDirPath,
	templatesDirPath,
	packageJsonTemplateFilePath,
	readmeTemplateFilePath,
	editorconfigPrettierrcTemplateFilePath,
} = require("../utils/paths.js");
// ============================================================================================== \\


build();

async function build() {
	await clean();
	await prepare();
	await make();
}

/**
 * Empties the `dist` and `tmp` directories.
 */
async function clean() {
	await Promise.all([emptyDir(distDirPath), emptyDir(tmpDirPath)]);
}

/**
 * Copies the configurations into the `tmp` directory and creates an associated editorconfig version as needed.
 */
async function prepare() {
	await copy(configsDirPath, tmpDirPath);

	await Promise.all(
		(await readdir(tmpDirPath))
			.filter(configDirName => configDirName !== "default")
			.map(async configDirName => {
				const editorConfigDirPath = join(tmpDirPath, `${configDirName}-editorconfig`);
				await copy(join(tmpDirPath, configDirName), editorConfigDirPath);
				await writeFile(
					join(editorConfigDirPath, ".prettierrc.js"),
					fromTemplate(
						await readFile(editorconfigPrettierrcTemplateFilePath, "utf8"),
						new Map([["base-config", configDirName]],
						),
					),
				);
			}),
	);
}


/**
 * Creates the Prettier configuration packages from the supplied configurations and templates.
 */
async function make() {
	const prettier = (await execFile(
			"npm",
			["view", "prettier", "version"],
			{ stdio: "pipe" })
	).stdout.trim();

	const packageJsonTemplate = require(packageJsonTemplateFilePath);

	await Promise.all(
		(await readdir(tmpDirPath))
			.map(async (configDirName, index, configs) => {

				// Paths -------------------------------------------------------
				const packageSrcDirPath = join(tmpDirPath, configDirName);
				const packageDestDirPath = join(distDirPath, configDirName);

				// Names and Descriptions --------------------------------------
				const packageNameSuffix = basename(packageDestDirPath) === "default" ?
										  "" :
										  `-${basename(packageDestDirPath)}`;
				const packageName = `@oliver-sieweke/prettier-config${packageNameSuffix}`;


				const description = `Oli's shareable Prettier configs - '${configDirName}' style.`;

				// Package Building --------------------------------------------
				await mkdir(packageDestDirPath);
				await Promise.all([

					// Configs: .prettierrc.json ...............................
					writeFile(
						join(packageDestDirPath, ".prettierrc.json"),
						JSON.stringify(
							require(join(tmpDirPath, configDirName, ".prettierrc.js")),
							null,
							4,
						),
					),

					// Configs: .prettierignore.................................
					copy(
						join(packageSrcDirPath, ".prettierignore"),
						join(packageDestDirPath, ".prettierignore"),
					),

					// Templates: LICENSE, scripts..............................
					copyList(["LICENSE", "scripts", "assets"], templatesDirPath, packageDestDirPath),

					// Templates: README.md.....................................
					writeFile(
						join(packageDestDirPath, "README.md"),
						fromTemplate(
							await readFile(readmeTemplateFilePath, "utf8"),
							new Map([
									["package-name", packageName],
									["description", description],
									[
										"install-command",
										`npm install --saved-dev --save-exact ${packageName} prettier`,
									],
									["uninstall-command", `npm uninstall ${packageName}`],
									["npm-url", `https://www.npmjs.com/package/${packageName}`],
									[
										"see-also-list",
										configs.reduce((list, config) => `${list}\n- ${config}`, ""),
									],

								],
							),
						),
					),

					// TEMPLATES: package.json..................................
					execFile("npm", ["view", packageName, "version"], { stdio: "pipe" })
						.then(({ stdout }) => stdout.trim())
						.catch((err) => {
							if (err.stderr.startsWith("npm ERR! code E404")) {
								console.warn(`Could not find package "${packageName}", defaulting to initial version "1.0.0"`);
								return "1.0.0";
							} else {
								throw err;
							}
						})
						.then((version) => {
								writeFile(join(packageDestDirPath, "package.json"), JSON.stringify({
									...packageJsonTemplate,
									packageName,
									version,
									description,
									keywords: [...packageJsonTemplate.keywords, configDirName],
									peerDependencies: { prettier },
								}, null, 4));
							},
						),
				]);
			}),
	);
}

