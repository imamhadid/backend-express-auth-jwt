const express = require('express')
const route = require('./app/router/api.js')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const app = express()
const path = require('path')

// testing db
// try {
//   await db.authenticate();
//   console.log('Connection has been established successfully.');
// } catch (error) {
//   console.error('Unable to connect to the database:', error);
// }

//parser form-data
app.use('/res/img/', express.static(path.join(__dirname, '/res/img/')))

//parser json
app.use(bodyParser.json())

//parser xwww
// app.use(bodyParser.urlencoded({ extended: true }))

//file uplloaded
app.use(fileUpload({
  debug: false
}))

app.use(cors())
app.use(route)
app.use(express.json())


app.listen(5000, () => {
  console.log("listening to port 5000")
})