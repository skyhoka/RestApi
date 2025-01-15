require("./settings.js")
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb')
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 5000;
const axios = require("axios")
const { getBuffer, fetchJson } = require('./public/function.js') 
const { setTimeout: sleep } = require('timers/promises');
const { groq } = require('./public/openai.js') 
const { YtMp3, YtMp4 } = require('./public/youtube.js') 
const { fbdl } = require('./public/facebook.js') 
const { remini } = require('./public/remini.js')
const { igdl } = require('./public/instagram.js') 
const { brat } = require('./public/brat.js') 
const { chatbot } = require('./public/gpt.js')
const { uploaderImg } = require('./public/uploadImage.js');
const { tiktokdl } = require('./public/tiktok.js') 
const {
  convertCRC16,
  generateTransactionId,
  generateExpirationTime,
  elxyzFile,
  generateQRIS,
  createQRIS,
  checkQRISStatus
} = require('./public/orkut.js') 


app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "function")));
app.use(bodyParser.raw({ limit: '50mb', type: '*/*' }));

async function DellAllSecurity() {
  try {
    let data = {
    status: true, 
    security: "Berhasil Menghapus Semua Nomor"
    }
    const client = await MongoClient.connect(database_mongodb.url);
    const db = client.db(database_mongodb.dbname);
    const collection = db.collection(database_mongodb.collection.security);
    await collection.deleteMany({})
    return data
  } catch (err) {
    console.error('Error:', err);
  }
}

async function addSecurity(num) {
  try {
    apikeyinput = num.toLowerCase()
    let data = {
    status: true, 
    security: "Berhasil Menambahkan Nomor", 
    number: apikeyinput
    }
    const client = await MongoClient.connect(database_mongodb.url);
    const db = client.db(database_mongodb.dbname);
    const collection = db.collection(database_mongodb.collection.security);
    await collection.insertOne({ number: apikeyinput })
    return data
  } catch (err) {
    console.error('Error:', err);
  }
}

async function getSecurityDatabase() {
  try {
    const client = await MongoClient.connect(database_mongodb.url)
    const db = await client.db(database_mongodb.dbname);
    const collection = await db.collection(database_mongodb.collection.security)
    const data = await collection.find().toArray();
    const rst = await data.filter(e => e.number)
    return rst
  } catch (err) {
    console.error('Error:', err);
  }
}

async function delSecurity(apikeyinput) {
  try {
    apikeyinput = apikeyinput.toLowerCase()
    let data = {
    status: true, 
    security: "Berhasil Menghapus Nomor", 
    number: apikeyinput
    }
    const client = await MongoClient.connect(database_mongodb.url);
    const db = client.db(database_mongodb.dbname);
    const collection = db.collection(database_mongodb.collection.security);
    await collection.deleteOne({ number: apikeyinput })
    return data
  } catch (err) {
    console.error('Error:', err);
  }
}


async function getApikeyDatabase() {
  try {
    const client = await MongoClient.connect(database_mongodb.url)
    const db = await client.db(database_mongodb.dbname);
    const collection = await db.collection(database_mongodb.collection.apikey)
    const data = await collection.find().toArray();
    const rst = await data.filter(e => e.apikey)
    return rst
  } catch (err) {
    console.error('Error:', err);
  }
}

async function addApikey(apikeyinput) {
  try {
    apikeyinput = apikeyinput.toLowerCase()
    let data = {
    status: true, 
    apikey: "Berhasil Menambahkan Apikey"
    }
    const client = await MongoClient.connect(database_mongodb.url);
    const db = client.db(database_mongodb.dbname);
    const collection = db.collection(database_mongodb.collection.apikey);
    await collection.insertOne({ apikey: apikeyinput })
    return data
  } catch (err) {
    console.error('Error:', err);
  }
}


async function delApikey(apikeyinput) {
  try {
    apikeyinput = apikeyinput.toLowerCase()
    let data = {
    status: true, 
    apikey: "Berhasil Menghapus Apikey!"
    }
    const client = await MongoClient.connect(database_mongodb.url);
    const db = client.db(database_mongodb.dbname);
    const collection = db.collection(database_mongodb.collection.apikey);
    await collection.deleteOne({ apikey: apikeyinput })
    return data
  } catch (err) {
    console.error('Error:', err);
  }
}

app.get('/api/orkut/createpayment', async (req, res) => {
    const { apikey, amount } = req.query;
    if (!apikey) {
    return res.json("Isi Parameter Apikey.");
    }
    const check = await getApikeyDatabase()
    if (!check.map(e => e.apikey).includes(apikey)) return res.json("Apikey Tidak Valid!.")
    if (!amount) {
    return res.json("Isi Parameter Amount.")
    }
    const { codeqr } = req.query;
    if (!codeqr) {
    return res.json("Isi Parameter CodeQr menggunakan qris code kalian.");
    }
    try {
        const qrData = await createQRIS(amount, codeqr);
        res.json({ status: true, creator: global.creator, result: qrData });        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.get('/api/orkut/cekstatus', async (req, res) => {
    const { merchant, keyorkut } = req.query;
        if (!merchant) {
        return res.json("Isi Parameter Merchant.")
    }
    if (!keyorkut) {
        return res.json("Isi Parameter Keyorkut.");
    }
    try {
        const apiUrl = `https://gateway.okeconnect.com/api/mutasi/qris/${merchant}/${keyorkut}`;
        const response = await axios.get(apiUrl);
        const result = await response.data;
                // Check if data exists and get the latest transaction
        const latestTransaction = result.data && result.data.length > 0 ? result.data[0] : null;
                if (latestTransaction) {
            res.json(latestTransaction);
        } else {
            res.json({ message: "No transactions found." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
// Endpoint untuk servis dokumen HTML
app.get('/', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log("Client : " + ip)
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.get("/api/tools/openai", async (req, res) => {
    const { prompt, msg } = req.query;
    if (!prompt || !msg) return res.json("Isi Parameternya!");

    try {
        var anu = await groq(`${msg}`, `${prompt}`)
        if (!anu.status) {
        res.json ({
        status: false,
        creator: global.creator,
        result: anu.respon
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu.respon     
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/tools/gptchat1", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json("Isi Parameternya!");

    try {
        var anu = await chatbot.send(`${text}`, "gpt-3.5-turbo")
        if (!anu?.choices[0]?.message?.content) {
        res.json ({
        status: false,
        creator: global.creator,
        result: null
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu.choices[0].message.content
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})


app.get("/api/tools/gemini", async (req, res) => {
    const { text } = req.query;
    if (!text) return res.json("Isi Parameternya!");

try {
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCPlGoKHoePXhHIaI7TLUESYgExSiB5XbI");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = text

const result = await model.generateContent(prompt);
const anu = await result.response.text()
       
        if (!anu) {
        res.json ({
        status: false,
        creator: global.creator,
        result: null
        })
        }

        res.json({
            status: true,
            creator: global.creator,
            result: anu
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})


app.get("/api/downloader/fbdl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await fbdl(`${url}`)
        res.json({
        status: true, 
        creator: global.creator, 
        result: anu
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/downloader/igdl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await igdl(`${url}`)
        res.json(anu)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/downloader/tiktokdl", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await tiktokdl.fetchData(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            result: anu     
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/api/downloader/ytmp3", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await YtMp3(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            metadata: anu.metadata, 
            download: anu.download             
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/downloader/ytmp4", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.json("Isi Parameternya!");

    try {
        var anu = await YtMp4(`${url}`)

        res.json({
            status: true,
            creator: global.creator,
            metadata: anu.metadata, 
            download: anu.download         
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get("/api/tools/remini", async (req, res) => {
    try {     
      const { url } = req.query
      if (!url) return res.json("Isi Parameternya!");
      const image = await getBuffer(url)
      if (!image) res.json("Error!");
      const result = await remini(image, "enhance")
      await res.set("Content-Type", "image/png")
      await res.send(result)
    } catch (error) {
        console.error(error);
        res.send(error)
    }
})


app.post("/api/tools/upload", async (req, res) => {
    try {     
      const image = req.body
      if (!image) return res.send("POST METHOD!")
      const result = await uploaderImg(image)
      if (!result.status) return res.send("Image Tidak Ditemukan!")
      return res.json(result)
    } catch (error) {
        console.error(error);
        res.send(error)
    }
})

app.get("/security/list", async (req, res) => {
    try {
      let result = await getSecurityDatabase()
      return res.json({
      security: result.map(e => e.number)
      })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/security/add", async (req, res) => {
    try {     
      let nomor = req.query.nomor
      if (isNaN(nomor)) return res.json("Nomor Tidak Valid!")
      nomor = nomor.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
      if (!nomor) return res.send("Nomor Tidak Ditemukan!")
      const result = await getSecurityDatabase()
     // if (result.map(e => e.number).includes(nomor)) return res.json("Nomor Sudah Tidak Terdaftar!")
      const dt = await addSecurity(nomor)
      return res.json(dt)
    } catch (error) {
        console.error(error);
        res.send(error)
    }
})


app.get("/security/del", async (req, res) => {
    try {     
      let { nomor } = req.query
      if (isNaN(nomor)) return res.json("Nomor Tidak Valid!")
      apikey = nomor.toLowerCase()
      nomor = nomor.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
      const result = await getSecurityDatabase()
      if (!result.map(e => e.number).includes(nomor)) return res.json("Nomor Tidak Terdaftar!")
      const dt = await delSecurity(nomor)
      return res.json(dt)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/security/delall", async (req, res) => {
    try {     
      let dt = await DellAllSecurity()
      return res.json(dt)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/apikey/list", async (req, res) => {
    try {
      let result = await getApikeyDatabase()
      return res.json({
      apikey: [...result.filter(e => e.apikey)]
      })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." })
    }
})

app.get("/apikey/add", async (req, res) => {
    try {     
      let { apikey } = req.query
      if (!apikey) return res.send("Masukan Apikey!")
      apikey = apikey.toLowerCase()
      const result = await getApikeyDatabase()
      if (result.map(e => e.apikey).includes(apikey)) return res.json("Apikey Sudah Terdaftar!")
      const dt = await addApikey(apikey)
      return res.json(dt)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})

app.get("/apikey/del", async (req, res) => {
    try {     
      let { apikey } = req.query
      if (!apikey) return res.send("Masukan Apikey!")
      apikey = apikey.toLowerCase()
      const result = await getApikeyDatabase()
      if (!result.map(e => e.apikey).includes(apikey)) return res.json("Apikey Tidak Terdaftar!")
      const dt = await delApikey(apikey)
      return res.json(dt)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
})




// Error Handling Middleware
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



