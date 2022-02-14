const express = require('express')
const app = express()
const port = 5000
const { User } = require("./models/User");
const bodyParser = require('body-parser');

const config = require('./config/key');


//application/x-www-form-urlencoded 형식으로 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true})); 

//application/json 타입으로 된 것을 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB successfully connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World! :D')
})

app.post('/register', (req, res) => {
    // 회원가입할 때 필요한 정보들을 client 에서 가져오면
    // 그것들을 DB에 넣어준다.
    
    const user = new User(req.body)

    user.save((err, userInfo) => {       //정보들이 user 모델에 저장됨
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    }) 
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



