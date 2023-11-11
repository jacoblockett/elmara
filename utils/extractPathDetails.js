import { existsSync, statSync } from "node:fs"
import { resolve, dirname, basename, extname } from "node:path"
import { platform } from "node:process"

/**
 * Extracts the directory base and filename of the given path.
 *
 * @param {String} string
 * @returns {{absolute: String, directory: String, filename: String, extension: String, type: String|undefined}}
 */
const extractPathDetails = string => {
	if (typeof string !== "string")
		throw new Error(`Expected string to be a string.`)

	const absolute = resolve(platform === "win32" ? string.toLowerCase() : string)
	const directory = dirname(absolute)
	const filename = basename(absolute)
	const extension = extname(filename)
	const exists = existsSync(absolute)
	const stats = existsSync(absolute)
		? statSync(absolute)
		: { isFile: () => false, isDirectory: () => false }
	const type = stats.isFile()
		? "file"
		: stats.isDirectory()
		? "directory"
		: undefined

	return { absolute, directory, filename, extension, type }
}

export default extractPathDetails
