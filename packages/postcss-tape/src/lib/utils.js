import fs from 'fs'

/** Reads a file and returns its string content */
export const readFile = (/** @type {string} */ pathname) => /** @type {Promise<string>} */ (
	new Promise((resolve, reject) => {
		fs.readFile(pathname, 'utf8', (error, data) => {
			if (error) {
				reject(error)
			} else {
				resolve(data)
			}
		})
	})
)

/** Returns a value from a JSON file. */
export const readJSON = (/** @type {string} */ pathname, /** @type {string[]} */ ...keys) => readFile(pathname).then(JSON.parse).then(
	opts => (
		keys.length
			? opts[
				Object.keys(opts).find(key => keys.includes(key))
			]
		: opts
	)
)

/** Returns the string content of a file if it exists, and otherwise creates the file and returns an empty string. */
export const readOrWriteFile = (/** @type {string} */ pathname, /** @type {string} */ data) => readFile(pathname).catch(
	() => writeFile(pathname, data || '').then(() => '')
)

/** Reads a file without throwing for any reason. */
export const safelyReadFile = (/** @type {string} */ pathname) => readFile(pathname).catch(() => '')

/** Writes a file. */
export const writeFile = (/** @type {string} */ pathname, /** @type {string} */ data) => new Promise((resolve, reject) => {
	fs.writeFile(pathname, data, (error) => {
		if (error) {
			reject(error)
		} else {
			resolve()
		}
	})
})
