import * as parser from "htmlparser2"
import urlHttp from "url-http"
import axios from "axios"
import serializeDOM from "dom-serializer"
import select, { selectOne } from "css-select"
import Bunch from "./bunch.js"
import Leaf from "./leaf.js"
import isUrl from "../utils/isUrl.js"
import isPath from "../utils/isPath.js"
import getResponse from "../utils/getResponse.js"
import getDocument from "../utils/getDocument.js"
import getCallerFile from "get-caller-file"
import getCallerDirectory from "../utils/getCallerDirectory.js"
import { Document, Element } from "domhandler"
import isParentNode from "../utils/isParentNode.js"

/**
 * Parses the given input, be it a url, document path, Cheerio/htmlparser2 object/instance, or
 * raw string of html/xml, into a traversable format.
 *
 * @param {String|Buffer|CheerioAPI|LoadedCheerio|Document|Element|CDATA} input The data to convert into a Leaf or Bunch
 * @param {Record<any, any>} [options] Options object that derives from html-parser-2's options object
 * @returns {Promise<Leaf|Bunch>} A traversable Leaf/Bunch object
 */
const elmara = async (input, options) => {
	if (Object.prototype.toString.call(options) !== "[object Object]") {
		options = {}
	}

	if (typeof input?.root === "function") {
		const document = input.root()?.get()?.[0]

		if (!(document instanceof Document)) return new Leaf()

		return new Leaf(document)
	} else if (typeof input?.get === "function") {
		const nodes = input.get()

		if (!Array.isArray(nodes)) return new Leaf()

		const copy = []
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i] instanceof Element) {
				copy[copy.length] = new Leaf(nodes[i])
			}
		}

		return new Bunch(copy)
	} else if (isParentNode(input)) {
		return new Leaf(input)
	} else if (Array.isArray(input) && input.every(isParentNode)) {
		const copy = []

		for (let i = 0; i < input.length; i++) {
			copy[copy.length] = new Leaf(input[i])
		}

		return new Bunch(copy)
	} else if (typeof input === "string" || Buffer.isBuffer(input)) {
		if (Buffer.isBuffer(input)) input = input.toString()

		let documentString = input
		if (isUrl(input)) {
			const response = await getResponse(input)

			documentString = response.data
		} else if (isPath(input)) {
			// isPath may give false positives because it doesn't check existence. Try/catch here
			// in case existence throws an error. Maybe there's a more elegant or smart way to
			// check this during isPath, but f it.
			try {
				// attempt to find a file with the given input
				const caller = getCallerDirectory(getCallerFile())
				const doc = getDocument(input, caller)

				if (doc !== undefined) documentString = doc
			} catch (err) {
				if (err.code !== "ENOENT") {
					throw new Error(
						`Couldn't read file for some stupid fucking reason:\n\n${err}`,
					)
				}
			}
		}

		try {
			const root = parser.parseDocument(documentString, options)

			return new Leaf(root)
		} catch (err) {
			throw new Error(`An error resulted from htmlparser2:\n\n${err}`)
		}
	}

	return new Leaf()
}

export default elmara
