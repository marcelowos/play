const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Userm = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const router = new express.Router()

//express provides methods for all http methods we need (post, get..)
 //fisrt param is the url
 //req and res are a giant object with a lot of parameters. both a body object wich conatis the info about the user
 // body: { name: 'kopa', email: 'kpag@deadpool.com', password: '123456789' }
 router.post('/users', async(req, res) => {
    //console.log(req.body)
    //console.log(req.body.name)
    //create new user using the info provided by the request
    //using the model created in user.js create a user
    const user = new Userm(req.body)
   // console.log(user)
    try{
        //after user is create create the token
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
       // console.log('token3')
        res.status(201).send({ user, token })
       // console.log('token4')
        //console.log(user)
    } catch (e) {
        res.status(400).send(e)
    }

    // //save the user in the db
    // user.save().then(() => {
    //       //send response back to server
    //       res.status(201).send(user)
    //     }).catch((e) => {
    //         res.status(400).send(e)
    //     })
})

router.post('/users/login', async (req,res) => {
    //find user by email and password
    //get email and password via post
    try {
        //call findByCredentials custom method passing email and password as parameters
        const user = await Userm.findByCredentials(req.body.email, req.body.password)
        //console.log(req.body.email) -> email via post
        //console.log(req.body.password) -> password via post
        //console.log(user) = user that matches email password above
        //generate token for the user returned from above
        const token = await user.generateAuthToken()

        //if an error isnt throw e get accces to the user and the token generated
        res.send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }
})
/////IF WANT TO READ ALL USERS
//calls auth to validate if user is loggedin
//only use auth if need to authenticate user
/* router.get('/users', auth, async (req, res) => {
    try {
        const users = await Userm.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    } */
    // //use mongoose queries on the model. 
    // //similar to the ones in mogo native drive used in connectmongo...js file and others
    // Userm.find({}).then((users) => {
    //     res.send(users)
    // }).catch(() => {
    //     res.status(500).send()
    // })
//})

router.post('/users/logout', auth, async(req, res) => {
    //console.log(req)
    try {
        //we are authenticated so we have acces to the user data in req from auth
        //filter the tokens array to find the token being used. filters return an arry tht excludes the element wich does not pass the filter criteria
        //req.token, req.user comes from auth
        req.user.tokens = req.user.tokens.filter( tokenloop => tokenloop.token !== req.token)
        //save new token array to the db
       
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
   // console.log(req)
    //req.user comes from auth after next is called, thus runing this router
    res.send(req.user)
})

//router.get('/users/:id', async(req, res) => {
    //store the id passed on the url
//     const _id = req.params.id

//     try{
//         const user = await Userm.findById(_id)
//         if(!user){
//             return res.status(404).send()
//     }
//       res.send(user)
//     } catch (e) {
//      res.status(500).send()

// }

    // //mongoose query
    // Userm.findById(_id).then((user) => {
    //     if(!user){
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch(() => {
    //     res.status(500).send()
    // })
//})

router.patch('/users/me', auth, async (req,res) => {
    //the user fetched by auth
    //console.log("..." + req.user)
    //the data that was requested to be updated by the endpoint
   // console.log(req.body)
    const updates = Object.keys(req.body)
    ///upadates são as chaves que forma enviadas para serem atualizadas
    //console.log(updates)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try{

       updates.forEach((update) => req.user[update] = req.body[update])
      // console.log(req.body.name) = nome atualizado 
     // console.log(req.user) = nome anterior
    //sem o save() não grava a mudança no banco de dados
     await req.user.save()
     
       //sem send() a chamada pra API não e feita
        res.send(req.user)

    } catch(e){
        res.status(400).send(e)
    }
})
router.delete('/users/me',auth , async(req, res) => {
//console.log(req.user)
    try{
       // await Userm.deleteOne({ _id: req.user._id })
       await req.user.deleteOne()
       sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
   
    } catch (e) {
        res.status(500).send(e.message)
    }
})
//new instance of multer. provide configurations for it
const upload = multer({
    //folder where files will be saved. folder is created automatically
   // dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
       // if(!file.originalname.endsWith('.pdf')){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('wrong file format'))
        }
        cb(undefined, true)
    }
})
//provide what comes back from single as second argument. requires name for the file uploaded. same name used in the request
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
  //save  file data on the model avatar field
  //req.user.avatar = req.file.buffer
  const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer()
  req.user.avatar = buffer
   await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})
router.delete('/users/me/avatar', auth, async(req, res) => {
    //console.log(req.user)
        try{
           // await Userm.deleteOne({ _id: req.user._id })
           req.user.avatar = undefined
            await req.user.save()
            res.send(req.user)
       
        } catch (e) {
            res.status(500).send(e.message)
        }
    })

router.get('/users/:id/avatar', async(req, res) => {
//http://localhost:3000/users/635736976b9c23613e6400c8/avatar

try{
 const user = await Userm.findById(req.params.id)

 if(!user || !user.avatar){
     throw new Error()
 }

 res.set('Content-Type', 'image/png')
 res.send(user.avatar)

}catch (e) {
    res.status(404).send()
}
})

module.exports = router