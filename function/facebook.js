const getFbVideoInfo = require("fb-downloader-scrapper")
require("../settings.js")

async function fbdl(fbUrl) {
try {
    const res = await getFbVideoInfo(fbUrl);
    return res
    } catch (error) {
    return console.log(error)
    }
}

module.exports = { fbdl }

