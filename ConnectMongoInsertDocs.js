//require npm to work with mongo. returns an object - have to install it
//then you can acces their properties (MongoClient, ObjectID)
////const mongodb = require('mongodb')
// acces to functions necessary to connect to database
////const MongoClient = mongodb.MongoClient
////const ObjectId = mongodb.ObjectId

//object destructuring. Same as above
const {MongoClient, ObjectId} = require('mongodb')

//generate own ids instead of using the ones created by mongo
//we are using the ids created by mongo, no need for the extra code
//const id = new ObjectId()
//id object stores some info, like the ones below
//console.log(id)
//console.log(id.getTimestamp())


//connection url to lclsocal database
const connectionURL = 'mongodb://127.0.0.1:27017'
//name your database
const databaseName = 'play-db'
//use mongoclient connect method to connect

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log('no connection')
    }
    //conected. you can interact and manipulate your database
    console.log('conect')
    //mongo db automatically creates the database. pick a name
    //store the database reference in a variable and use to manipulate it
    //client comes from the MongoClient.connect() call. 
    //Once we successfully connect to MongoDB, it gives us a client object and we can then choose which database in MongoDB to use from there.
    const db = client.db(databaseName)
    //insert data into a collection
    ///collection is a function that takes a collection name as argument
    //call a method on the collection reference, insert one in ths case
    //insertOne takes an object as argument, the data being inserted
    //mongo automatically creates an id for the inserted data
    //
    // db.collection('users').insertOne({
    //     //reference the id created above if creating your own ids
    //     //_id: id,
    //     name: 'spider man',
    //     job: 'friendly'
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('erro')
    //     }
    //     console.log(result.insertedId)
    // })

    db.collection('users').insertMany([
        {
        name: 'captain america',
        job: 'super hero'
        },
        {
            name: 'wonder woman',
            job: 'super hero'
        }
    ], (error, result) => {
        if(error){
            return console.log('erro')
        }
        console.log(result.insertedIds)
    })
})
//





