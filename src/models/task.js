//require mongoose library installed via npm
//mogoose uses mongodb library (installed in the connectMongo... file) behind the scenes
//so we can use mongodb methods too
const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true

    },
    completed: {
        type: Boolean,
        default: false
},
//save the user id who created the task
owner: {
    type:  mongoose.Schema.Types.ObjectId,
    required: true,
    //create reference to the user model. easy to fetch user profile
    ref: 'UserModelName'
}
}, {

    timestamps: true
   })
/* const TaskModel = mongoose.model('TaskModelName', {
    description: {
        type: String,
        trim: true,
        required: true

    },
    completed: {
        type: Boolean,
        default: false
},
//save the user id who created the task
owner: {
    type:  mongoose.Schema.Types.ObjectId,
    required: true,
    //create reference to the user model. easy to fetch user profile
    ref: 'UserModelName'
}
})
 */
const TaskModel = mongoose.model('TaskModelName', taskSchema)

//exports taskmodel so other files can use it to create new tasks
module.exports = TaskModel