import axios from "axios"
import chalk from "chalk"

/**
 * Attempts to perform a get request to the given url. If the url doesn't
 * include an https or http protocol, protocols will be appended to the
 * beginning of the given string in the order of https, http.
 *
 * @param {String} url The url endpoint to perform a get request to
 * @returns {Promise<AxiosResponse<any, any>>}
 */
const getResponse = async url => {
	if (typeof url !== "string") throw new Error(`Expected url to be a string.`)

	if (!url.startsWith("http")) {
		try {
			return await axios.get(`https://${url}`)
		} catch (error) {
			if (error.code === "ECONNABORTED" || error.message === "Network Error") {
				console.warn(
					chalk.yellow(
						"Warning: https coersion failed, falling back to http coersion.",
					),
				)

				try {
					return await axios.get(`http://${url}`)
				} catch (error) {
					throw new Error(
						`Failed to receive a response from either https://${url} or http://${url}. The following error was produced from Axios:\n\n${error}`,
					)
				}
			}

			throw new Error(`An error resulted from Axios:\n\n${error}`)
		}
	} else {
		try {
			return await axios.get(url)
		} catch (error) {
			throw new Error(`An error resulted from Axios:\n\n${error}`)
		}
	}
}

export default getResponse
