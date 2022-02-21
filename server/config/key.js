// 환경변수 -> process.env.NODE_ENV
// Local 환경일 때는 이 값이 development로 나오고
// 배포 한 후에는 production으로 나온다.

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}