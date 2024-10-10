export async function runAndPrintDebugOnFail(runningJob, prelude, helpMessage) {
	try {
		await runningJob;
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e);

		// eslint-disable-next-line no-console
		console.log(`-----------\n\n${prelude.trim()}\n\n${helpMessage.trim()}`);

		process.exit(1);
	}
}
