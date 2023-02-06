const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const token = require('../middleware/getToken.js')
const handle = require('../middleware/handleToken.js')
const path = require('path')
const rawGenrate = 10

const loginUser = async (req, res) => {
    const users = await User.findAll({
        where: {
            email: req.body.email
        }
    })

    if (users[0] === null | users[0] === '' | users[0] === undefined) {
        return res.status(409)
            .json({
                success: false,
                errors: {
                    message: "Email tidak terdaftar"
                },
            })
    }

    bcrypt
        .compare(req.body.password, users[0].password)
        .then(async checkPassword => {
            if (checkPassword == true) {

                await User.update({
                    tokenFb: req.body.tokenFb,
                }, {
                    where: {
                        email: req.body.email
                    }
                });

                return res.status(200)
                    .json({
                        success: true,
                        email: users[0].email,
                        role: users[0].role,
                        token: "Bearer " + token(users[0].id, users[0].fullName, users[0].email, users[0].role)
                    })

            }
            else {
                return res.status(409)
                    .json({
                        success: false,
                        errors: {
                            message: "Password salah"
                        },
                    })
            }
        })

}


const registerUser = async (req, res) => {

    const users = await User.findAll({
        where: {
            email: req.body.email
        },
        attributes: [
            'email'
        ]
    })

    if (users[0] !== null && users[0] !== '' && users[0] !== undefined) {
        return res.status(409)
            .json({
                success: false,
                errors: {
                    message: "Email telah terdaftar",
                }
            })
    }

    const arr = ['admin', 'user', 'staff'];

    if (!arr.includes(req.body.role)) {
        return res.status(409)
            .json({
                success: false,
                errors: {
                    message: "Role tidak ditemukan"
                },
            })
    }

    var password;
    await bcrypt.hash(req.body.password, rawGenrate).then(hash => {
        password = hash
    })


    try {
        const createUser = await User.create({
            email: req.body.email,
            password: password,
            fullName: req.body.fullName,
            role: req.body.role,
            photo: `https://consultantapp.rydhdev.com/res/img/9.png`,
            numberPhone: req.body.numberPhone,
        })
        return res.status(201)
            .json({
                success: true,
                createUser
            })
    } catch (err) {

        const errObj = {};
        err.errors.map(er => {
            errObj[er.path] = er.message;
        })
        return res.status(409)
            .json({
                success: false,
                errors: errObj
            })
    }

}


const getProfile = async (req, res) => {

    const bearerHeader = req.headers['authorization']
    let user;
    try {
        user = handle(bearerHeader, res)
    } catch (err) {
        return res.status(409)
            .json({
                success: false,
                errors: {
                    message: 'User tidak dikenal'
                }
            })
    }

    const userData = await User.findAll({
        where: {
            id: user.id
        },
        attributes: {
            exclude: ['password']
        }
    })

    return res.status(200)
        .json({
            success: true,
            data: userData[0]
        })
}

const updateProfile = async (req, res) => {

    const bearerHeader = req.headers['authorization']
    let user;
    try {
        user = handle(bearerHeader, res)
    } catch (err) {
        return res.status(409)
            .json({
                success: false,
                errors: {
                    message: 'User tidak dikenal'
                }
            })
    }

    if (!req.files) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Tidak ada photo'
            }
        })
    }
    const file = req.files.photo
    let dirphoto = `./res/img/${user.id}.${file.mimetype.slice(6)}`
    let dest = path.resolve(dirphoto)
    
    file.mv(dest, async (err) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            const updateUser = await User.update({
                photo: `https://consultantapp.rydhdev.com/res/img/${user.id}.${file.mimetype.slice(6)}`,
            }, {
                where: {
                    id: user.id
                }
            });

            return res.status(200)
                .json({
                    success: true,
                    statusUpdate: updateUser[0]
                })
        }
    })

    
} 


const updateProfileData = async (req, res) => {

    const bearerHeader = req.headers['authorization']
    let user;
    try {
        user = handle(bearerHeader, res)
    } catch (err) {
        return res.status(409)
            .json({
                success: false,
                errors: {
                    message: 'User tidak dikenal'
                }
            })
    }

    const updateUser = await User.update({
        email: req.body.email,
        fullName: req.body.fullName,
        role: req.body.role,
        numberPhone: req.body.numberPhone
    }, {
        where: {
            id: user.id
        }
    });
    return res.status(200)
        .json({
            success: true,
            statusUpdate: updateUser[0]
        })
} 

const updatePassword = async (req, res) => {

    const bearerHeader = req.headers['authorization']
    let user;
    try {
        user = handle(bearerHeader, res)
    } catch (err) {
        return res.status(409)
            .json({
                success: false,
                errors: {
                    message: 'User tidak dikenal'
                }
            })
    }

    const userData = await User.findAll({
        where: {
            id: user.id
        }
    })

    bcrypt
        .compare(req.body.password, userData[0].password)
        .then(async checkPassword => {
            if (checkPassword == false) {
                return res.status(409)
                    .json({
                        success: false,
                        errors: {
                            message: "Password salah"
                        },
                    })
            } else {
                var password;
                await bcrypt.hash(req.body.newPassword, rawGenrate).then(hash => {
                    password = hash
                })

                const updateUser = await User.update({
                    password: password,
                }, {
                    where: {
                        id: user.id
                    }
                });
                return res.status(200)
                    .json({
                        success: true,
                        statusUpdate: updateUser[0]
                    })
            }
        })
    
    
} 


module.exports = {
    updatePassword,
    updateProfileData,
    updateProfile,
    getProfile,
    registerUser,
    loginUser
}