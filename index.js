const express = require('express')
const app = express()
const port = 4000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin:1234@boilerplate.4bnrtvc.mongodb.net/?retryWrites=true&w=majority', {})
    .then(() => console.log('MongoDB Connected ...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => res.send("hello world!!"))

app.listen(port, () => console.log(`Example app listening on port ${port}`))