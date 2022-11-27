export function helpTextLogger(command, name, description, exampleOptions = null) {
    let pluginOptions = [];
    if (exampleOptions) {
        const longestPluginOptionLength = Math.max(...Object.keys(exampleOptions).map((x) => x.length));
        const spaces = new Array(longestPluginOptionLength).fill(' ').join('');
        if (spaces.length) {
            pluginOptions = [
                '\nPlugin Options:',
                ...Object.keys(exampleOptions).map((option) => {
                    return `  ${(option + spaces).slice(0, spaces.length)}  ${typeof exampleOptions[option]}`;
                }),
            ];
            pluginOptions.push(`\n  ${JSON.stringify(exampleOptions, null, 2).split('\n').join('\n  ')}`);
        }
    }
    const allHelp = [
        `${name}\n`,
        `  ${description}\n`,
        'Usage:',
        `  ${command} [input.css] [OPTIONS] [-o|--output output.css]`,
        `  ${command} <input.css>... [OPTIONS] --dir <output-directory>`,
        `  ${command} <input.css>... [OPTIONS] --replace`,
        '\nOptions:',
        '  -o, --output          Output file',
        '  -d, --dir             Output directory',
        '  -r, --replace         Replace (overwrite) the input file',
        '  -m, --map             Create an external sourcemap',
        '  --no-map              Disable the default inline sourcemaps',
        '  -p, --plugin-options  Stringified JSON object with plugin options',
    ];
    if (pluginOptions.length > 0) {
        allHelp.push(...pluginOptions);
    }
    return () => {
        console.warn(allHelp.join('\n'));
    };
}
