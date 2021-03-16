/** Exit the process logging an error and with a failing exit code. */
export const fail = (error) => {
	console.log(error)

	process.exit(1)
}

/** Exit the process with a passing exit code. */
export const pass = () => {
	process.exit(0)
}
