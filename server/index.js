import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);





const express = require('express')
const app = express()
const port = 5000
const { User } = require("./models/User");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');


const config = require('./config/key');


//application/x-www-form-urlencoded 형식으로 된 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true})); 

//application/json 타입으로 된 것을 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB successfully connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World! :D')
})

app.post('/api/users/register', (req, res) => {
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


app.post('/api/users/login', (req, res) => {
    // 요청된 이메일을 DB에 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        
        
        // 요청된 이메일이 DB에 있다면, 비밀번호가 맞는지 확인한다.
        user.comparePassword(req.body.password , (err, isMatch) => {
            if(!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
            
            
            // 비밀번호까지 같다면 Token을 생성한다. 
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                
                // token을 저장한다. 쿠키, 세션 또는 로컬 스토리지 등
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})





app.get('/api/users/auth', auth, (req, res) => {
    // 여기까지 미들웨어를 통과해왔다는 얘기는 Authentication이 true 라는 말

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})




app.get('/api/users/logout', auth, (req, res) => {
    // console.log('req.user', req.user)
    User.findOneAndUpdate({ _id: req.user._id }, 
        { token: "" },
        (err, user) => {
            if(err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
})




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



