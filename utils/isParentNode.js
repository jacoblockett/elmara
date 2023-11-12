import { Document, Element, CDATA } from "domhandler"

const isParentNode = obj => {
	if (obj instanceof Document) return true
	if (obj instanceof Element) return true
	if (obj instanceof CDATA) return true

	return false
}

export default isParentNode
