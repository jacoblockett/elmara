import urlHttp from "url-http"

/**
 * Checks if the given string is a valid url.
 *
 * @param {String} string
 * @returns {Boolean}
 */
const isUrl = string => {
	if (typeof string !== "string")
		throw new Error(`Expected string to be a string.`)

	if (!!urlHttp(string)) return true
	if (!!urlHttp(`https://${string}`)) return true

	return false
}

export default isUrl
