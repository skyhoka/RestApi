const { alldl } = require("rahad-media-downloader")

async function YtMp3(url) {
return new Promise(async (resolve, reject) => {
const links = url
try {
const res = await alldl(links)
resolve(res)
} catch (e) {
reject(e) 
}
})
}

async function YtMp4(url) {
return new Promise(async (resolve, reject) => {
const links = url
try {
const res = await alldl(links)
resolve(res)
} catch (e) {
reject(e) 
}
})
}

module.exports = { YtMp3, YtMp4 }