const express = require('express')
const Taskm = require('../models/task')
const auth = require('../middleware/auth')
const { query } = require('express')
const router = new express.Router()

router.post('/tasks', auth, async(req, res) => {

    const task = new Taskm({
        //copuy all properties from req.body to this object
        ...req.body,
        //add owner prop to associate the task with the creator. get owner from the authentication
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    } catch (e){
        res.status(400).send(e)
    }
    // task.save().then(() => {
    //       //send response back to server
    //       res.status(201).send(task)
    //     }).catch((e) => {
    //         res.status(400).send(e)
    //     })
})
//{{url}}/tasks?completed=true&limit=3&skip=0&createdAt:asc
router.get('/tasks',auth, async(req,res) => {
    
    const match = {}
    const sort = {}

    if(req.query.completed){
        //req.query.completed === 'true' or false e uma string
        //match.completed vira bolean dependendo do resultado acima
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
       
        const parts = req.query.sortBy.split(':')
        console.log(parts)
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1

    }

   // console.log(req.user)
    try {
       //const tasks = await Taskm.find({})
      await req.user.populate({
          path: 'tasks',
         //match is the obj created abobe
          match,
          options:{
              limit: parseInt(req.query.limit),
              skip: parseInt(req.query.skip),
              sort
            
          }
          
      })
      //console.log(sort)
      res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send()
    }
    //use mongoose queries on the model. 
    //similar to the ones in mogo native drive used in connectmongo...js file and others
//     Taskm.find({}).then((task) => {
//         //console.log(task[0].description)
//         res.send(task)
//     }).catch(() => {
//         res.status(500).send()
//     })
 })

 router.get('/tasks/:id',auth,  async(req, res) => {
    const _id = req.params.id

    try{
       // const task = await Taskm.findById(_id)
       // if task id existe and if token is the same as the one stored in owner
       const task = await Taskm.findOne({_id, owner: req.user._id})

        if(!task){
            return res.status(404).send()
        }
        //send to server
        res.send(task)
    } catch(e){
        res.status(500).send()
    }
    // //store the id passed on the url
    // const _id = req.params.id
    // //mongoose query
    // Taskm.findById(_id).then((task) => {
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch(() => {
    //     res.status(500).send()
    // })

})

router.patch('/tasks/:id',auth,  async (req,res) => {
    const updates = Object.keys(req.body)
    //console.log(updates)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try{
        // get the id from url
        // get the request body
        //new true returns the updated user
        //run validations
       // const task = await Taskm.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        const task = await Taskm.findOne({_id: req.params.id, owner: req.user._id})
      
        if(!task){
           return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth, async(req, res) => {

    try{
        const task = await Taskm.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(400).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router