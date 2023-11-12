import { textContent, getSiblings, getParent } from "domutils"
import serializeDOM from "dom-serializer"
import select, { selectOne } from "css-select"
import { minify } from "html-minifier-terser"
import Bunch from "./bunch.js"
import { Element } from "domhandler"
import isParentNode from "../utils/isParentNode.js"

class Leaf {
	#node

	/**
	 * Creates a Leaf - an individual node representing an element
	 * from a markup language document.
	 *
	 * @param {Document|Element|Text|Record<unknown>} node
	 * @returns {Leaf}
	 */
	constructor(node = {}) {
		if (
			!isParentNode(node) &&
			Object.prototype.toString.call(node) !== "[object Object]"
		) {
			throw new Error(`Invalid node type.`)
		}

		this.#node = node || {}
	}

	/**
	 * Returns the children of the Leaf.
	 *
	 * @param {Boolean} [convert] Boolean option to convert found children to Leaves (default = true)
	 * @returns {any[]}
	 */
	#getChildren(convert = true) {
		const children = this.#node.children

		if (children === undefined || children?.length === 0) {
			return []
		}

		const elementsOnly = []
		for (let i = 0; i < children.length; i++) {
			if (children[i] instanceof Element) {
				elementsOnly.push(convert ? new Leaf(children[i]) : children[i])
			}
		}

		return elementsOnly
	}

	/**
	 * Returns an object of attributes on the Leaf.
	 *
	 * Same as {@link attributes}
	 * @returns {Record<String, String>}
	 */
	get attr() {
		return this.#node.attribs || {}
	}

	/**
	 * Returns an object of attributes on the Leaf.
	 *
	 * Same as {@link attr}
	 * @returns {Record<String, String>}
	 */
	get attributes() {
		return this.#node.attribs || {}
	}

	/**
	 * Returns the child Leaves of the Leaf. Undefined if no children elements
	 * are found.
	 *
	 * @returns {Bunch|undefined}
	 */
	get children() {
		const children = this.#getChildren()

		if (children.length === 0) return undefined

		return new Bunch(children)
	}

	/**
	 * Returns the first child of the Leaf's children.
	 *
	 * @returns {Leaf|undefined}
	 */
	get firstChild() {
		const children = this.#getChildren()

		if (children.length === 0) return undefined

		return children[0]
	}

	/**
	 * Returns the next sibling of the Leaf.
	 *
	 * @returns {Leaf|undefined}
	 */
	get nextSibling() {
		let nextSibling = this.#node.next

		if (!nextSibling) return undefined

		while (!(nextSibling instanceof Element)) {
			const newNextSibling = nextSibling.next

			if (!newNextSibling) return undefined

			nextSibling = newNextSibling
		}

		return new Leaf(nextSibling)
	}

	/**
	 * Returns the serialized/stringified version of the Leaf's children.
	 *
	 * @returns {String}
	 */
	get innerMarkup() {
		return serializeDOM(this.#getChildren(false))
	}

	/**
	 * Returns the last child of the Leaf's children.
	 *
	 * @returns {Leaf|undefined}
	 */
	get lastChild() {
		const children = this.#getChildren()

		if (children.length === 0) return undefined

		return children[children.length - 1]
	}

	/**
	 * Returns the serialized/stringified version of the Leaf.
	 *
	 * @returns {String}
	 */
	get markup() {
		return serializeDOM(this.#node)
	}

	/**
	 * Returns the tag name of the Leaf.
	 *
	 * @returns {String}
	 */
	get name() {
		return this.#node.name ?? ""
	}

	/**
	 * Returns the parent Leaf of the Leaf. Will return undefined if no parent exists.
	 * (This should only happen if you've queried the parent of a root node.)
	 *
	 * @returns {Leaf|undefined}
	 */
	get parent() {
		return this.#node.parent ? new Leaf(this.#node.parent) : undefined
	}

	/**
	 * Returns the next sibling of the Leaf.
	 *
	 * Same as {@link previousSibling}
	 *
	 * @returns {Leaf|undefined}
	 */
	get prevSibling() {
		let prevSibling = this.#node.prev

		if (!prevSibling) return undefined

		while (!(prevSibling instanceof Element)) {
			const newPrevSibling = prevSibling.prev

			if (!newPrevSibling) return undefined

			prevSibling = newPrevSibling
		}

		return new Leaf(prevSibling)
	}

	/**
	 * Returns the next sibling of the Leaf.
	 *
	 * Same as {@link prevSibling}
	 *
	 * @returns {Leaf|undefined}
	 */
	get previousSibling() {
		let prevSibling = this.#node.prev

		if (!prevSibling) return undefined

		while (!(prevSibling instanceof Element)) {
			const newPrevSibling = prevSibling.prev

			if (!newPrevSibling) return undefined

			prevSibling = newPrevSibling
		}

		return new Leaf(prevSibling)
	}

	/**
	 * Returns the root of the entire document.
	 *
	 * @returns {Leaf}
	 */
	get root() {
		let node = this.#node.parent || this.#node

		while (!!node) {
			if (!node.parent) break

			node = node.parent
		}

		return new Leaf(node)
	}

	/**
	 * Returns the sibling Leaves of the Leaf, including itself.
	 *
	 * @returns {Bunch}
	 */
	get siblings() {
		const siblings = getSiblings(this.#node)

		let copy = []
		for (let i = 0; i < siblings.length; i++) {
			if (siblings[i] instanceof Element) {
				copy.push(new Leaf(siblings[i]))
			}
		}

		return new Bunch(copy)
	}

	/**
	 * Returns the text content of the Leaf. Ignores comments.
	 *
	 * @returns {String}
	 */
	get text() {
		return textContent(this.#node)
	}

	/**
	 * Returns the type of the Leaf.
	 *
	 * @returns {String}
	 */
	get type() {
		return this.#node.type
	}

	/**
	 * Minifies and returns the Leaf's __children's__ markup representation. The defaults to the options argument
	 * are identical to html-minifier-terser's defaults except for `collapseWhitespace` (`true`), and
	 * `html5` (`false`).
	 *
	 * @param {Object} options Options object that derives from html-minifier-terser's options object
	 * @returns {Promise<String>}
	 */
	innerMinify(options) {
		if (Object.prototype.toString.call(options) !== "[object Object]") {
			options = {}
		}
		if (typeof options.collapseWhitespace !== "boolean") {
			options.collapseWhitespace = true
		}
		if (typeof options.html5 !== "boolean") {
			options.html5 = false
		}

		return minify(serializeDOM(this.#getChildren(false)), options)
	}

	/**
	 * Minifies and returns the Leaf's markup representation. The defaults to the options argument
	 * are identical to html-minifier-terser's defaults except for `collapseWhitespace` (`true`), and
	 * `html5` (`false`).
	 *
	 * @param {Object} options Options object that derives from html-minifier-terser's options object
	 * @returns {Promise<String>}
	 */
	minify(options) {
		if (Object.prototype.toString.call(options) !== "[object Object]") {
			options = {}
		}
		if (typeof options.collapseWhitespace !== "boolean") {
			options.collapseWhitespace = true
		}
		if (typeof options.html5 !== "boolean") {
			options.html5 = false
		}

		return minify(serializeDOM(this.#node), options)
	}

	/**
	 * Returns the nth child of the Leaf from the given position. The nth positions are
	 * indexed starting at 1 (i.e. there is no zeroth position). Returns undefined
	 * if there is not child at the given position.
	 *
	 * @param {Number} position The position/index of the child to get
	 * @returns {Leaf|undefined}
	 */
	nthChild(position) {
		if (typeof position !== "number" || position < 1)
			throw new Error(`Expected position to be a number >= 1.`)

		const children = this.#getChildren()

		return children[position - 1]
	}

	/**
	 * Returns the matches of the given query. Will always return a Bunch.
	 *
	 * @param {String} query The css selector query
	 * @param {Number} [n] The number of results to return
	 * @returns {Bunch}
	 */
	select(query, n) {
		if (typeof query !== "string")
			throw new Error(`Expected query to be a string`)

		const found = select(query, this.#node)

		const copy = []
		for (let i = 0; i < found.length; i++) {
			copy[i] = new Leaf(found[i])
		}

		if (typeof n === "number" && n > 0 && n < copy.length) {
			copy.length = n
		}

		return new Bunch(copy)
	}

	/**
	 * Returns the first match of the given query.
	 *
	 * @param {String} query The css selector query
	 * @param {Number} [n] If multiple results are found, will select the nth result (1-based-indexed)
	 * @returns {Leaf|undefined}
	 */
	selectOne(query, n = 0) {
		if (typeof query !== "string")
			throw new Error(`Expected query to be a string`)
		if (typeof n !== "number") throw new Error(`Expected n to be a number`)

		const found = select(query, this.#node)

		if (!found.length) return new Leaf()

		if (n > 0 && n <= found.length) {
			return new Leaf(found[n - 1] || undefined)
		} else {
			return new Leaf(found[0])
		}
	}

	unwrap() {
		return this.#node
	}
}

export default Leaf
