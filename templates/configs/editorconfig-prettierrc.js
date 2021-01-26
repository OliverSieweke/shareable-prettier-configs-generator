module.exports = {
	// We are extending the base config that will be located in a sibling directory
	...require("../{{base-config}}/.prettierrc.js"),
	// Properties Inferred from Editorconfig:
	printWidth: undefined, 		// inferred from max_line_length
	useTabs: undefined, 		// inferred from indent_style
	tabWidth: undefined, 		// inferred from tab_width and ident_size
	endOfLine: undefined,		// inferred from end_of_line
};
