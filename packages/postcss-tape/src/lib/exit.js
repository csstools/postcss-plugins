export function exitFail (error) {
	console.log(error)

	process.exit(1)
}

export function exitPass () {
	process.exit(0)
}
