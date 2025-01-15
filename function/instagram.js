require("../settings.js")
const instagramGetUrl = require("instagram-url-direct")

async function igdl (url) {
let links = await instagramGetUrl(url).then((res) => {
return {
status: true, 
creator: global.creator, 
result: {
type: res.media_details.find(e => e.type == "image") ? "image" : "video", 
url: res.media_details.find(e => e.type == "image") ? res.media_details.map(e => e.url) : res.media_details[0].url
}
}
}).catch((e) => {
return {
status: false, 
creator: global.creator, 
result: {}
}
})
return links
}

module.exports = { igdl }