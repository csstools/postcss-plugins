import postcss from 'postcss';
import { getStdin } from './get-stdin';
// Read from stdin and write to stdout
export async function stdinToStdout(plugin, argo, helpLogger) {
    let resultCSS = '';
    try {
        const css = await getStdin();
        if (!css) {
            helpLogger();
            process.exit(1);
        }
        const result = await postcss([plugin]).process(css, {
            from: 'stdin',
            to: 'stdout',
            map: argo.inlineMap ? { inline: true } : false,
        });
        result.warnings().forEach(warn => {
            console.warn(warn.toString());
        });
        resultCSS = result.css;
    }
    catch (error) {
        console.error(argo.debug ? error : error.message);
        process.exit(1);
    }
    // Only write to stdout if there was no error.
    process.stdout.write(resultCSS + (argo.inlineMap ? '\n' : ''));
    process.exit(0);
}
