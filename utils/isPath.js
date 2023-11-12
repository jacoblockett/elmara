import isInvalidPath from "is-invalid-path"
import isRelativePath from "is-relative-path"
import { existsSync } from "node:fs"
import { isAbsolute } from "node:path"

/**
 * Checks if the given string is a valid path. Doesn't check if the path
 * exists, just checks if there's no invalid characters in the path string.
 *
 * @param {String} string
 * @returns {Boolean}
 */
const isPath = string => {
	if (typeof string !== "string")
		throw new Error(`Expected string to be a string`)

	// TODO: investigate if isInvalidPath is necessary here. WINDOWS ONLY
	if (!isInvalidPath(string) || isAbsolute(string) || isRelativePath(string)) {
		return true
	}

	return false
}

export default isPath
