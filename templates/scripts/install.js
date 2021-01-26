const { createReadStream, readFileSync, writeFileSync, appendFileSync } = require("fs");
const { hostPackageJsonFile, hostPackageJsonIndentation, ownPrettierignoreFile, hostPackagePrettierignoreFile } = require("./utils.js");
const readline = require("readline")

try {

	writeFileSync(
		hostPackageJsonFile,
		// The JSON parsing below is safe as NPM will fail first if the host package.json is not valid JSON
		JSON.stringify({ ...require(hostPackageJsonFile), prettier: process.env.npm_package_name },
			null,
			hostPackageJsonIndentation),
	);


	// make get Lines function.

	const rl = readline.createInterface({
		input: createReadStream(hostPackagePrettierignoreFile),
		crlfDelay: Infinity
	});
	// Note: we use the crlfDelay option to recognize all instances of CR LF
	// ('\r\n') in input.txt as a single line break.

	for await (const line of rl) {
		// Each line in input.txt will be successively available here as `line`.
		console.log(`Line from file: ${line}`);
	}


	appendFileSync(hostPackagePrettierignoreFile, readFileSync(ownPrettierignoreFile, "utf8"))


	console.log(`✅    \x1b[42m\x1b[30m Prettier configs added to the project ➡ "prettier": "${process.env.npm_package_name}" \x1b[0m    🐢\n`);

} catch(err) { // In case the package root is not found

	console.log(err)
	console.log(`🟡   \x1b[43m\x1b[30m Add Prettier configs manually to your package.json ➡ "prettier": "${process.env.npm_package_name}" \x1b[0m    🐝\n`);

}




