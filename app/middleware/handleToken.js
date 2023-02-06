const Jwt = require("jsonwebtoken")

const handle = (token) => {
    const bearer = token.split(' ')
    const bearerToken = bearer[1]
    
    const auth = Jwt.verify(bearerToken, 'secret')
    return auth
    
}

module.exports = handle