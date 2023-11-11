import { SweetArray } from "@jacoblockett/sweetroll"
import Leaf from "./leaf.js"

class Bunch {
	#leaves

	/**
	 * Creates a Bunch - a collection of nodes representing elements
	 * from a markup language document.
	 *
	 * @param {Document[]} leaves
	 */
	constructor(leaves) {
		if (!Array.isArray(leaves))
			throw new Error(`Expected leaves to be an array.`)

		const copy = []
		for (let i = 0; i < leaves.length; i++) {
			if (leaves[i] === undefined || leaves[i] === null) continue
			if (!(leaves[i] instanceof Leaf) && !(leaves[i] instanceof Bunch))
				throw new Error(
					`Expected all in leaves to be an instance of a Leaf or Bunch.`,
				)

			copy[copy.length] = leaves[i]
		}

		this.#leaves = new SweetArray(copy)
	}

	/**
	 * Returns an object of attributes of each Leaf or Bunch in the Bunch.
	 *
	 * Same as {@link attributes}
	 * @returns {Record<String, String>[]}
	 */
	get attr() {
		return this.#leaves.map(s => s.attr).unwrap()
	}

	/**
	 * Returns an object of attributes of each Leaf or Bunch in the Bunch.
	 *
	 * Same as {@link attr}
	 * @returns {Record<String, String>[]}
	 */
	get attributes() {
		return this.#leaves.map(s => s.attributes).unwrap()
	}

	/**
	 * Returns the child Leaves of each Leaf or Bunch in the Bunch.
	 *
	 * @returns {Bunch}
	 */
	get children() {
		return new Bunch(this.#leaves.map(s => s.children).unwrap())
	}

	/**
	 * Returns the first child of each Leaf or Bunch in the Bunch.
	 *
	 * @returns {Leaf}
	 */
	get firstChild() {
		return new Bunch(this.#leaves.map(s => s.firstChild).unwrap())
	}

	/**
	 * Returns the serialized/stringified version of each Leaf or Bunch in the Bunch's children.
	 *
	 * @returns {String[]}
	 */
	get innerMarkup() {
		return this.#leaves.map(s => s.innerMarkup).unwrap()
	}

	/**
	 * Returns the last child of each Leaf or Bunch in the Bunch.
	 *
	 * @returns {Leaf}
	 */
	get lastChild() {
		return new Bunch(this.#leaves.map(s => s.lastChild).unwrap())
	}

	/**
	 * Returns the length of the Bunch, or how many Leaves are in the Bunch.
	 *
	 * @returns {Number}
	 */
	get length() {
		return this.#leaves.length
	}

	/**
	 * Returns the serialized/stringified version of each Leaf or Bunch in the Bunch.
	 *
	 * @returns {String[]}
	 */
	get markup() {
		return this.#leaves.map(s => s.markup).unwrap()
	}

	/**
	 * Returns the tag name of each Leaf or Bunch in the Bunch.
	 *
	 * @returns {String[]}
	 */
	get name() {
		return this.#leaves.map(s => s.name).unwrap()
	}

	/**
	 * Returns the next sibling of each Leaf or Bunch in the Bunch.
	 *
	 * @returns {Bunch}
	 */
	get nextSibling() {
		return new Bunch(this.#leaves.map(s => s.nextSibling).unwrap())
	}

	/**
	 * Returns the parent Leaf of each Leaf or Bunch in the Bunch. Will return undefined
	 * if no parent exists. (This should only happen if you've queried the parent
	 * of a root node.)
	 *
	 * @returns {Bunch}
	 */
	get parent() {
		return new Bunch(this.#leaves.map(s => s.parent).unwrap())
	}

	/**
	 * Returns the next sibling of each Leaf or Bunch in the Bunch.
	 *
	 * Same as {@link previousSibling}
	 *
	 * @returns {Bunch}
	 */
	get prevSibling() {
		return new Bunch(this.#leaves.map(s => s.prevSibling).unwrap())
	}

	/**
	 * Returns the next sibling of each Leaf or Bunch in the Bunch.
	 *
	 * Same as {@link prevSibling}
	 *
	 * @returns {Bunch}
	 */
	get previousSibling() {
		return new Bunch(this.#leaves.map(s => s.previousSibling).unwrap())
	}

	/**
	 * Returns the root of the entire document for each Leaf or Bunch in the Bunch.
	 *
	 * @returns {Bunch}
	 */
	get root() {
		return new Bunch(this.#leaves.map(s => s.root).unwrap())
	}

	/**
	 * Returns the sibling Leaves of each Leaf or Bunch in the Bunch.
	 *
	 * @returns {Bunch}
	 */
	get siblings() {
		return new Bunch(this.#leaves.map(s => s.siblings).unwrap())
	}

	/**
	 * Returns the text content of each Leaf or Bunch in the Bunch. Ignores comments.
	 *
	 * @returns {String[]}
	 */
	get text() {
		return this.#leaves.map(s => s.text).unwrap()
	}

	/**
	 * Returns the type of each Leaf or Bunch in the Bunch.
	 *
	 * @returns {String[]}
	 */
	get type() {
		return this.#leaves.map(s => s.type).unwrap()
	}

	/**
	 * Executes the given function for each of the Leaves in the Bunch.
	 *
	 * Same as {@link forEach}
	 *
	 * @param {(leaf: Leaf, index: Number) => void} callback
	 * @returns {Bunch}
	 */
	each(callback) {
		this.#leaves.forEach(callback)

		return this
	}

	/**
	 * Executes the given function for each of the Leaves in the Bunch.
	 *
	 * Same as {@link each}
	 *
	 * @param {(leaf: Leaf, index: Number) => void} callback
	 * @returns {Bunch}
	 */
	forEach(callback) {
		this.#leaves.forEach(callback)

		return this
	}

	/**
	 * Minifies each Leaf or Bunch's __children's__ markup representation. The defaults to the options argument
	 * are identical to html-minifier-terser's defaults, except for `collapseWhitespace` (`true`), and
	 * `html5` (`false`).
	 *
	 * @param {Object} options Options object that derives from html-minifier-terser's options object
	 * @returns {Promise<Bunch>}
	 */
	innerMinify(options) {
		return Promise.all(
			this.#leaves.map(async s => await s.innerMinify(options)).unwrap(),
		)
	}

	/**
	 * Loops over each item in the SweetArray, replacing the items with the return value of
	 * the callback function provided.
	 *
	 * @param {(leaf: Leaf, index: Number) => any} callback
	 * @returns {Bunch}
	 */
	map(callback) {
		return new Bunch(this.#leaves.map(callback).unwrap())
	}

	/**
	 * Minifies each Leaf or Bunch's markup representation. The defaults to the options argument
	 * are identical to html-minifier-terser's defaults, except for `collapseWhitespace` (`true`), and
	 * `html5` (`false`).
	 *
	 * @param {Object} options Options object that derives from html-minifier-terser's options object
	 * @returns {Promise<Bunch>}
	 */
	minify(options) {
		return Promise.all(
			this.#leaves.map(async s => await s.minify(options)).unwrap(),
		)
	}

	/**
	 * Returns the nth child of each Leaf or Bunch in the Bunch from the given position.
	 * The nth positions are indexed starting at 1 (i.e. there is no zeroth position).\
	 * Returns undefined if there is not child at the given position.
	 *
	 * @param {Number} position The position/index of the child to get
	 * @returns {Bunch}
	 */
	nthChild(position) {
		return new Bunch(this.#leaves.map(s => s.nthChild(position)))
	}

	/**
	 * Returns the Leaf or Bunch at the given index. If the index is negative,
	 * this method will count backwards from the end of the bunch.
	 *
	 * @param {Number} index The index of which Leaf to return
	 * @returns {Leaf|Bunch}
	 */
	pick(index) {
		return this.#leaves.getItem(index)
	}

	/**
	 * Returns the matches of the given query for each Leaf or Bunch in the Bunch.
	 * Will always return a Bunch.
	 *
	 * @param {String} query The css selector query
	 * @param {Number} [n] The number of results to return
	 * @returns {Bunch}
	 */
	select(query, n) {
		return new Bunch(this.#leaves.map(s => s.select(query, n)).unwrap())
	}

	/**
	 * Returns the first match of the given query for each Leaf or Bunch in the Bunch.
	 *
	 * @param {String} query The css selector query
	 * @returns {Bunch}
	 */
	selectOne(query) {
		return new Bunch(this.#leaves.map(s => s.selectOne(query)).unwrap())
	}

	/**
	 * Executes the given function for each of the Leaves in the Bunch and returns the
	 * Leaves in which the given function returned a truthy value.
	 *
	 * @param {(leaf: Leaf, index: Number) => any} callback
	 * @returns {Bunch}
	 */
	sift(callback) {
		return new Bunch(this.#leaves.filter(callback).unwrap())
	}

	unwrap() {
		return this.#leaves
	}
}

export default Bunch
