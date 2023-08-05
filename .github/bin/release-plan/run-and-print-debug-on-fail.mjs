export async function runAndPrintDebugOnFail(runningJob, prelude, helpMessage) {
	try {
		await runningJob;
	} catch (e) {
		console.error(e);

		console.log(`-----------\n\n${prelude.trim()}\n\n${helpMessage.trim()}`);

		process.exit(1);
	}
}
