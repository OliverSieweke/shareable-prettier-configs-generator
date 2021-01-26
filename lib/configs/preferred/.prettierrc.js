module.exports = {
	printWidth: 20,                        // Default: 80
	tabWidth: 4,                            // Default: 2
	useTabs: true,                          // Default: false
	tabs: true,                             // Default: false
	semi: true,                             // Default: true
	singleQuote: false,                     // Default: false
	quoteProps: "as-needed",                // Default: "as-needed"
	jsxSingleQuote: false,                  // Default: false
	trailingComma: "all",                   // Default: "es5"
	bracketSpacing: true,                   // Default: true
	jsxBracketSameLine: false,              // Default: false
	arrowParens: "always",                  // Default: "always"
	// parser: ""                           // Default: inferred
	requirePragma: false,                   // Default: false
	insertPragma: false,                    // Default: false
	proseWrap: "preserve",                  // Default: preserve
	htmlWhitespaceSensitivity: "css",       // Default: "css"
	vueIndentScriptAndStyle: true,          // Default: false
	endOfLine: "lf",                        // Default: "lf"
	embeddedLanguageFormatting: "auto",     // Default: "auto"
	overrides: [                            // Default: []
		{
			"files": [], // Add ESLint style glob patterns here (https://eslint.org/docs/user-guide/configuring#configuration-based-on-glob-patterns)
			"options": {},
		},
	],
};
