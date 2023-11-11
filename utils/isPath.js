import isInvalidPath from "is-invalid-path"

/**
 * Checks if the given string is a valid path. Doesn't check if the path
 * exists, just checks if there's no invalid characters in the path string.
 *
 * @param {String} string
 * @returns {Boolean}
 */
const isPath = string => !isInvalidPath(string)

export default isPath
