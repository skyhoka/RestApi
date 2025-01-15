const { rahadytdl } = require('rahad-media-downloader')

async function YtMp3(url) {
return new Promise(async (resolve, reject) => {
const links = url
try {
const res = await rahadytdl(links)
resolve(res)
} catch (e) {
reject(e) 
}
})
}

async function rahadytdl(url) {
return new Promise(async (resolve, reject) => {
const links = url
try {
const res = await ytmp4(links)
resolve(res)
} catch (e) {
reject(e) 
}
})
}

module.exports = { YtMp3, YtMp4 }