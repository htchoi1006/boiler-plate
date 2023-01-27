const express = require('express')
const app = express()
const port = 4000
const bodyParser = require('body-parser');
const { User } = require("./models/User");
const config = require('./config/key');


app.use(express.json());
app.use(express.urlencoded({extended: true}));


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {})
    .then(() => console.log('MongoDB Connected ...'))
    .catch(err => console.log(err))

    mongoose.set('strictQuery', false);
app.get('/', (req, res) => res.send("hello world!!!!!!!!!!!"))

app.post('/register', (req, res) => {
    //회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어줌
    const user = new User(req.body)

    //user model이 mongoDB에 저장
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))

