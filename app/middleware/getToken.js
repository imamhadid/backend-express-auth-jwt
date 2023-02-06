const Jwt = require("jsonwebtoken")

const token = (id, fullName, email, role) => {
    const token = Jwt.sign(
        {
            id: id,
            fullName: fullName,
            email: email,
            role: role,
        },
        'secret',
        { expiresIn: '365d' })

    return token
}

module.exports = token