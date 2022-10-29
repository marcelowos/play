//require express server installed via npm
const express = require('express')
//require mongoose file to connect to database. not gonna grab anything from that, so donot need to store in variable
require('./db/mongoose')
//import user and task model
//const Userm = require('./models/user')
//const Taskm = require('./models/task')
const userRouter = require('./routers/userouters')
const taskRouter = require('./routers/taskrouters')


//set up server
const app = express()
const port = process.env.PORT


//parser incoming json into object so we can use in our requests
//acessed via req.body
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//init server
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
//end set up server




