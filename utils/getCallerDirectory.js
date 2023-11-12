import { fileURLToPath } from "node:url"
import { dirname } from "node:path"

const getCallerDirectory = callerFilepath => {
	if (typeof callerFilepath !== "string")
		throw new Error(`Expected callerFilepath to be a string`)

	const path = fileURLToPath(callerFilepath)

	return dirname(path)
}

export default getCallerDirectory
