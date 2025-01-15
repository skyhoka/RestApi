const axios = require("axios")

async function shortUrl(links) {
return new Promise(async (resolve, reject) => {
try {
var res = await axios.get('https://tinyurl.com/api-create.php?url='+encodeURIComponent(links))
resolve(res.data.toString())
} catch (error) {
reject(error)
}
})
}

module.exports = { shortUrl }