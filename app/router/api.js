const express = require('express')
const router = express.Router()

const {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    updateProfileData,
    updatePassword
} = require("../controllers/auth.js")

const {
    createConsul,
    getConsul,
    updateConsul,
    deleteConsul,
    postPaymentGetway,
    testNotif,
    updateConsulStatus,
    getConsulHisotry
} = require("../controllers/consultants")

const {
    getChat,
    postChat
} = require('../controllers/chat.js')


// route auth
router.post('/register', registerUser)
router.post('/login',loginUser)
router.get('/profile', getProfile)
router.put('/profile-photo', updateProfile)
router.put('/profile', updateProfileData)
router.put('/change-password', updatePassword)

// route apps
router.post('/create', createConsul)
router.get('/consultant', getConsul)
router.get('/consultant-history', getConsulHisotry)
router.put('/consultant/:id', updateConsul)
router.delete('/consultant/:id', deleteConsul)
router.put('/end-consultant/:id', updateConsulStatus)

// route notif
router.post('/notif', postPaymentGetway)
router.post('/test', testNotif)

// route chat
router.get('/chat/:id', getChat)
router.post('/chat/:id', postChat)


module.exports = router