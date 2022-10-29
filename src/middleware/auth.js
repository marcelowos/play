const jwt = require('jsonwebtoken')
const User = require('../models/user')

//check if the token is valid before proceeding
const auth = async (req, res, next) => {
        //console.log(req.method, req.path) => method and path of the API called
       //this req does not have info about the user
       // console.log(req)
        try{
            console.log('auth')
            //store the token passed in the request as a header
            const token = req.header('Authorization').replace('Bearer ', '')
            //console.log(token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
           // console.log(decoded)
            //find the user with the correct id and has the token still stored
            const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
            if(!user){
                throw new Error() //runs catch
            }
            //store the token, in case of logout know wich token is being used if user has more than one
            req.token = token
            //add propety to req to store the user, no need to feth them again
           req.user = user
           //console.log(user)
            //if user found run route
            next()

        }catch(e){
            res.status(401).send({ error: 'Please login'})

        }
}

module.exports = auth