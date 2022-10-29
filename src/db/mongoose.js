//require mongoose library installed via npm
//mogoose uses mongodb library (installed in the connectMongo... file) behind the scenes
//so we can use mongodb methods too
const mongoose = require('mongoose')


//connect to databse - databasAddres/databaseName
mongoose.connect(process.env.MONGODB_URL)



//create a new user based on the model
// const me = new UserModel({
//     name: '     bruce',
//     email: 'xxx@GAMIL.com',
//     password: 'senha10'
// })

// // //save to the databse using methods on the instance (me)
// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log('error', error)
// })



// const task = new TaskModel({
//     description: 'drawn',
//     completed: false
// })

// task.save().then(() => {
//     console.log(task)
// }).catch((error) => {
//     console.log('error', error)
// })