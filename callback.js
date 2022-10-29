//this is the same
const work = (callx) => {
    callx(undefined, 'succes')
}

const x = (error, result) => {
    if(error){
        return console.log('error')
    }
    console.log(result)
}

work(x)

//as this

const doWorkCallback = (callback) => {

       callback(undefined, [1, 4, 7])
   
}
 
doWorkCallback((error, result) => {
    if(error) {
        return console.log(error)
    }
 
    console.log(result)
 
})
