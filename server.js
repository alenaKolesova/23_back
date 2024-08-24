const express = require('express')
const app = express()
app.use(express.json())
const port = 2000
var cors = require('cors')

require('dotenv').config()

//#region Mongo
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const Serial = mongoose.model('Serial', {
    name: String,
    poster: String,
    actors: [String],
    description: String
});

//#endregion

app.use(cors())

app.use('/', express.static('public'))

app.get('/api/serial', async (req, res) => {
    let allSerials = await Serial.find()
    res.json(allSerials)
})

app.post('/api/serial', async (req, res) => {
    let serial = req.body

    if(!serial._id) serial._id = new mongoose.Types.ObjectId()
    await Serial.findByIdAndUpdate(serial._id, serial, {upsert: true})
    res.json({'status': true,
        'id':  serial._id
    }
    )
})

app.post('/api/serial/delete', async (req, res) => {
    let serial = req.body
    await Serial.findByIdAndDelete(serial._id)
    res.json({'status': true})
})

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`)
})