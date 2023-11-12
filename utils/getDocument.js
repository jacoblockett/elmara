import { readFileSync, readdir, readdirSync } from "node:fs"
import { sep } from "node:path"
import { platform } from "process"
import extractPathDetails from "./extractPathDetails.js"

/**
 * Attempts to find and return the data from the given path. Will attempt
 * to coerce the filename with the .html and .xml extensions.
 *
 * @param {String} string The absolute, relative, or pseudo-path to find
 * @param {String} caller The calling file in which to use for relative paths
 * @returns {String|undefined} The stringified data from the found document
 */
const getDocument = (string, caller) => {
	if (typeof string !== "string")
		throw new Error(`Expected string to be a string.`)

	const path = extractPathDetails(string, caller)

	if (path.type === "directory") {
		// check for index.html, then check for any html/xml files. If a singular file exists,
		// use that one.

		const files = readdirSync(path.absolute)
		const matches = []

		for (let i = 0; i < files.length; i++) {
			const file = platform === "win32" ? files[i].toLowerCase() : files[i]

			if (/^index\.html$/i.test(file))
				return getDocument(`${path.absolute}${sep}${file}`)
			if (/\.(html|xml)$/i.test(file)) matches[matches.length] = file
		}

		if (matches.length !== 1) return undefined

		return getDocument(`${path.absolute}${sep}${matches[0]}`)
	} else if (path.type === "file") {
		const data = readFileSync(path.absolute)

		return data.toString()
	} else {
		// check to see if there's a file with an html/xml extension that matches the filename
		// of the path provided.

		const files = readdirSync(path.directory)
		const matches = []

		for (let i = 0; i < files.length; i++) {
			const file = platform === "win32" ? files[i].toLowerCase() : files[i]

			if (/\.(html|xml)$/i.test(file) && file.startsWith(path.filename))
				matches[matches.length] = file
		}

		if (matches.length !== 1) return undefined

		const data = readFileSync(`${path.directory}${sep}${matches[0]}`)

		return data.toString()
	}
}

export default getDocument
