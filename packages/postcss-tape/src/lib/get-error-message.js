export default function getErrorMessage (error) {
	return Object(error).message || error
}
