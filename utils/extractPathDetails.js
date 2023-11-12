import { existsSync, statSync, readdirSync } from "node:fs"
import { resolve, dirname, basename, extname, isAbsolute, sep } from "node:path"
import { platform } from "node:process"

/**
 * Extracts the directory base and filename of the given path.
 *
 * @param {String} path
 * @param {String} caller The calling file in which to use for relative paths
 * @returns {{absolute: String, directory: String, filename: String, extension: String, type: String|undefined}}
 */
const extractPathDetails = (path, caller) => {
	if (typeof path !== "string") throw new Error(`Expected path to be a string.`)
	if (typeof caller !== "string")
		throw new Error(`Expected caller to be a string.`)

	let absolute
	if (isAbsolute(path)) {
		absolute = platform === "win32" ? path.toLowerCase() : path
	} else {
		return extractPathDetails(resolve(caller, path), "")
	}

	const directory = dirname(absolute)
	const filename = basename(absolute)
	const extension = extname(filename)
	const exists = existsSync(absolute)
	const stats = existsSync(absolute)
		? statSync(absolute)
		: { isFile: () => false, isDirectory: () => false }
	let type

	if (stats.isDirectory()) {
		// just in case, check if any files have the same filename with .html or .xml first
		const files = readdirSync(directory)
		const matches = []

		for (let i = 0; i < files.length; i++) {
			const file = platform === "win32" ? files[i].toLowerCase() : files[i]

			if (/\.(html|xml)$/i.test(file) && file.startsWith(filename))
				matches[matches.length] = file
		}

		if (matches.length === 1) {
			return extractPathDetails(`${directory}${sep}${matches[0]}`, caller)
		} else {
			type = "directory"
		}
	} else if (stats.isFile()) {
		type = "file"
	}

	return { absolute, directory, filename, extension, type }
}

export default extractPathDetails
