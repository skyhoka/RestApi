const { ytmp3, ytmp4 } = require('ruhend-scraper')

async function YtMp3(url) {
return new Promise(async (resolve, reject) => {
const links = url
try {
const res = await ytmp3(links)
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
const res = await ytmp4(links)
resolve(res)
} catch (e) {
reject(e) 
}
})
}

module.exports = { YtMp3, YtMp4 }