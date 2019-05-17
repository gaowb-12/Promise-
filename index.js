let Promise_=require("./promise.js")

let promise1=new Promise_((resolve,reject)=>{
    let random=Math.random()
    setTimeout(() => {
        if(random>0.5){
            resolve(random)
        }else{
            reject(random)
        }
    }, 500);
})
promise1
.then((value)=>{
    console.log(value)
},(err)=>{
    console.log(err)
})
