import { parseArguments, SignalValue } from './args';
import { stdinToStdout } from './io-stdin-to-stdout';
import { stdinToFs } from './io-stdin-to-fs';
import { fsToStdout } from './io-fs-to-stdout';
import { fsToFs } from './io-fs-to-fs';
export * from './help';
export async function cli(plugin, allowedPluginOpts, helpLogger, standalone = true) {
    // Get process and plugin options from the command line
    const argo = parseArguments(process.argv.slice(standalone ? 2 : 3), allowedPluginOpts, helpLogger);
    if (argo === SignalValue.InvalidArguments) {
        process.exit(1);
    }
    const pluginInstance = plugin(argo.pluginOptions);
    // Read from stdin and write to stdout
    if (argo.stdin && argo.stdout) {
        await stdinToStdout(pluginInstance, argo, helpLogger);
        return;
    }
    // Read from stdin and write to a file
    if (argo.stdin) {
        await stdinToFs(pluginInstance, argo, helpLogger);
        return;
    }
    // Read from one or more files and write to stdout
    if (argo.stdout) {
        await fsToStdout(pluginInstance, argo);
        return;
    }
    // Read from one or more files and write to as many files
    await fsToFs(pluginInstance, argo);
}
