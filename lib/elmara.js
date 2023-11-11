import * as parser from "htmlparser2"
import urlHttp from "url-http"
import axios from "axios"
import serializeDOM from "dom-serializer"
import select, { selectOne } from "css-select"
import Bunch from "./bunch.js"
import Leaf from "./leaf.js"
import isUrl from "../utils/isUrl.js"
import getResponse from "../utils/getResponse.js"
import isPath from "./../utils/isPath.js"
import extractPathDetails from "../utils/extractPathDetails.js"

/**
 * Parses the given input into a traversable format. Returns a traversable Leaf object.
 *
 * @param {String} input The raw html or xml as a string
 * @param {Object} [options] Options object that derives from html-parser-2's options object
 * @returns {Leaf|Promise<Leaf>}
 */
const elmara = async (input, options) => {
	if (typeof input !== "string")
		throw new Error(`Expected input to be a string`)
	if (Object.prototype.toString.call(options) !== "[object Object]") {
		options = {}
	}

	let documentString = input
	if (isUrl(input)) {
		const response = await getResponse(input)

		documentString = response.data
	} else if (isPath(input)) {
		const path = extractPathDetails(input)

		if (!path.extension) {
			// attempt to append .html first
		}
	}

	try {
		const root = parser.parseDocument(documentString, options)

		return new Leaf(root)
	} catch (err) {
		throw new Error(`An error resulted from htmlparser2:\n\n${err}`)
	}
}

export default elmara
