const { writeFileSync } = require("fs");
const { hostPackageJsonFile, hostPackageJsonIndentation } = require("./utils.js");

try {

	const hostPackageJson = require(hostPackageJsonFile)

	if (hostPackageJson.prettier === process.env.npm_package_name) {
		writeFileSync(
			hostPackageJsonFile,
			// The JSON parsing below is safe as NPM will fail first if the host package.json is not valid JSON
			JSON.stringify({ ...hostPackageJson, prettier: undefined },
				null,
				hostPackageJsonIndentation),
		);

		console.log(`❌    \x1b[41m\x1b[30m Prettier configs removed from the project ➡ "prettier": "${process.env.npm_package_name}" \x1b[0m    🦑`);
		console.log(`🟡   \x1b[43m\x1b[30m You may want to update or remove the ".prettierignore" file manually \x1b[0m    🐝\n`);
	}

} catch { // In case the package root is not found

	console.log(`🟡   \x1b[43m\x1b[30m Remove Prettier configs manually from your package.json ➡ "prettier": "${process.env.npm_package_name}" \x1b[0m    🐝\n`);

}
