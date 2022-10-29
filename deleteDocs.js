//require npm to work with mongo. returns an object - have to install it
//then you can acces their properties (MongoClient, ObjectID)
////const mongodb = require('mongodb')
// acces to functions necessary to connect to database
////const MongoClient = mongodb.MongoClient
////const ObjectId = mongodb.ObjectId

//object destructuring. Same as above
const { ObjectID } = require('bson')
const {MongoClient, ObjectId} = require('mongodb')

//generate own ids instead of using the ones created by mongo
//we are using the ids created by mongo, no need for the extra code
//const id = new ObjectId()
//id object stores some info, like the ones below
//console.log(id)
//console.log(id.getTimestamp())


//connection url to local database
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
    // const db = client.db(databaseName)
    // db.collection('users').deleteMany({
    //     job: 'super hero'
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
    const db = client.db(databaseName)
    db.collection('users').deleteOne({
        name: 'wonder woman'
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
    
})
//





