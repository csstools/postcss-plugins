import { promises as fsp } from 'fs';
import postcss from 'postcss';
// Read from one or more files and write to stdout
export async function fsToStdout(plugin, argo) {
    let allCss = [];
    try {
        allCss = await Promise.all(argo.inputs.map(async (input) => {
            const css = await fsp.readFile(input);
            const result = await postcss([plugin]).process(css, {
                from: input,
                to: 'stdout',
                map: false,
            });
            result.warnings().forEach(warn => {
                console.warn(warn.toString());
            });
            return result.css;
        }));
    }
    catch (error) {
        console.error(argo.debug ? error : error.message);
        process.exit(1);
    }
    for (const css of allCss) {
        process.stdout.write(css);
    }
    process.exit(0);
}
