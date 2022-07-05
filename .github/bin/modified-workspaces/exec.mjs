import { spawn } from 'child_process';

// Run a child proc
// - throws on non-zero exit codes
// - returns { stderr: ..., stdout: ... } when successful
// Is mainly a more ergonomic API for `spawn`.
export async function exec(cmd, args) {
	const result = await new Promise( ( resolve, reject ) => {
		const childProc = spawn(
			cmd,
			[...args],
		);

		let stdout = '';
		let stderr = '';

		childProc.stdout.on( 'data', ( data ) => {
			stdout += data.toString();
		} );

		childProc.stderr.on( 'data', ( data ) => {
			stderr += data.toString();
		} );

		childProc.on( 'close', ( code ) => {
			if ( 0 !== code ) {
				reject( new Error( `${cmd} failed with code ${code} and message "${stderr}"` ) );

				return;
			}

			resolve({
				stderr: stderr,
				stdout: stdout,
			});
		} );
	} );

	return result;
}
