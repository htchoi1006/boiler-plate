const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //띄어쓰기 자동으로 없애주는 역할 
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

})

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) { //오직 비밀번호 변경시에만 비밀번호 암호화 (불필요한 암호화 방지)
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            // plain password를 hash로 교체해줌
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        }) 
    } else {    //비밀번호 말고 다른걸 바꾸는 경우
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    
    // plainPassword 12345678      암호화된 비밀번호 $2b$10$PxY5c4fh0ctIHEvYCTnv4O5NdBeu85Gx4rRJoD7SP53OOdp1VNPFG
    // plainPassword를 암호화해서 기존의 암호화된 비밀번호와 똑같은지 확인한다. 

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
            cb(null, isMatch)
    })
}




userSchema.methods.generateToken = function(cb) {

    var user = this;

    //jsonwebtoken을 이용해서 token을 생성한다.

    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null, user)
    })
    
}


userSchema.statics.findByToken = function( token, cb ){
    var user = this;

    //token 을 복호화한다. 
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 보관된 token이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token }, function(err,user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}


const User = mongoose.model('User', userSchema)

module.exports = { User }