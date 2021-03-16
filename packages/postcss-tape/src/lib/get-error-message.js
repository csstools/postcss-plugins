/** Return the error message. */
export const getErrorMessage = (/** @type {Error | string} */ error) => String(
	Object(error).message || error
)
