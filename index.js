// let Promise_=require("./promise.js")

let promise1=new Promise_((resolve,reject)=>{
    let random=Math.random()
    setTimeout(() => {
        if(random>0.5){
            resolve(random)
        }else{
            reject(random)
        }
    }, 500);
    // resolve(555)
})
var p2=promise1
.then((value)=>{
    console.log(value)
    return new Promise_(function(resolve,reject){
        // setTimeout(() => {
            resolve(new Promise_(function(resolve,reject){
                setTimeout(() => {
                    resolve(222)
                }, 2000);
            }))
        // }, 1000);
    })
},(err)=>{
    console.log(err)
})
.then((value)=>{
    console.log(value)
},(err)=>{
    console.log(err)
})
