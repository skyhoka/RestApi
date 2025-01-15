const axios = require("axios")

const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}


async function brat(teks) {
try {
const anuan = await getBuffer(`https://api.brat.us.kg/brat?q=${teks}`)
const buffer = anuan
return anuan
} catch (e) {
}
}

module.exports = { brat }
