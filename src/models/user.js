//require mongoose library installed via npm
//mogoose uses mongodb library (installed in the connectMongo... file) behind the scenes
//so we can use mongodb methods too
const mongoose = require('mongoose')
//library o validate data, install by npm
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
//create schema to cutomize model and use middleware = plugin type to help add funcionalidades to the model, using pre and post
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            //use the validator library required above
            if(!validator.isEmail(value)){
                throw new Error("email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error ('Password cannot contain "passwod"')
            }
        }

    },
    age: {
        type: Number,
        default: 0,
        //mongoose provides few built-in validation methods
        //we can create our own too like below
        validate(value) {
            if(value < 0){
                throw new Error('Age must be a poitive number')
            }
        }
    },
    //keep track of the user tokens
 /*    The reason for that is to achieve a functionality that allows us to be logged in with multiple devices at once. So we then have a token for PC login, another token if you log in with e.g. a mobile device and so on.
Or, as it was said in the video - imagine that you have bought a family subscription for Netflix. Multiple people can sign in to one account with the same user and password, that you shared with them with various devices. */
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {

 timestamps: true
})

//create a virtual relation between models. does not get create a new property on the model. does not save in the db
// Mongoose needs to know which fields it needs to associate with each other so it can connect the two collections. 
// We're telling Mongoose to map the _id (local field) for each user to the owner (foreign field) in each task. 
// Now when we fetch the user, we can also fetch all of their tasks.
// The localField represents the field you want to connect on the userSchema and the foreignField
//  represents the field on the taskSchema. You can read it as:
// Find Tasks where localField is equal to foreignField
// Mongoose just queries the other model internally, for you. It will essentially do:
// Tarea.find({ 'usario': user._id })
// And return the result back to you in the instance of the User model.
userSchema.virtual('tasks', {
    ref: 'TaskModelName',
    localField: '_id',
    foreignField: 'owner'
})


//pre -> before an event, like save
//post ->  before an event
//statics ->  methods used in the model
userSchema.statics.findByCredentials = async (email, password) => {
    //find user with email provided as argument in the api call
   // console.log(email , password)
    const user = await UserModel.findOne({ email })
    //console.log(user) => user that matches the email

    if(!user){
        throw new Error('unable to login')
    }
 //if password is the same = password is the parameter provided, user.password is the password for the user returned
    const isMatch = await bcrypt.compare(password, user.password) 

    if(!isMatch){
        throw new Error('unable to login')
    }
    return user
}
/* when we run our code res.send(obj), it will automatically run JSON.stringify(obj), which in turns uses 
obj.toJSON() to convert it into JSON, but as we have customised the method, it will also 
remove the password and tokens. */
//Mongoose documents are read-only so you have to turn it into an object to be able to modify it.

userSchema.methods.toJSON = function (){
    console.log('json')
    // when express executes res.send(...) it calls JSON.stringify() to convert objects to a JSON string to send the client.
    // When express calls JSON.stringify() on the user doc/object the userSchema.methods.toJSON method we created is called. 
    // The modified return value from it is then sent to the client. 
    // The modification literally happens as the last step as the data leaves the server.
    //we created this method  to customize the object, deleting password and tokens
    const user = this
/*  The toObject method is a method provided by Mongoose to clean up 
    the object so it removes all of the metadata and methods (like .save() or .toObject())
    that Mongoose attaches to it. It just becomes a regular object afterward. */
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
//methods -> used on the instances of the schema -> being used on user
userSchema.methods.generateAuthToken = async function (){
     //console.log('token')
    const user = this
    //use jwt method sign, first arg the user id, second can be any sequence of characteres 
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    //add the token generated above to the user to be saved in the db
    user.tokens = user.tokens.concat({ token })
    //save the user in the db
    //mongoose can use methods like .save() on the object
    await user.save()
   // console.log('token2')
    return token

}


//first argument the event to use, second fuction, cannot be arrow function
//hash the plain text password before saving
userSchema.pre('save', async function (next) {
   //lways will be called if save is executed
    console.log('save')
    const user = this
    //console.log(user)
    //check if 'password' has been changed. true user first created and if password has been updated
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)

    }
    //call next to contiue code after the function runs
    //if do not call next the functon will never stop running
    next()

})
//delete user tasks when user is removed
userSchema.pre('deleteOne',{document: true}, async function(next){
    const user = this
    //console.log('delete task')
    await Task.deleteMany({ owner: user._id })
    next()
})
//first argument is the name of the colletion
const UserModel = mongoose.model('UserModelName', userSchema)

//exports usermodel so other files can use it to create new users
module.exports = UserModel