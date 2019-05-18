const PENDING="pending"//promsie的未完成状态
const FULFILLED="fulfilled"//promsie的成功状态
const REJECTED="rejected"//promsie的失败状态
function Promise_(excutor){
    let self= this// 保存this
    self.status=PENDING//初始化promise的状态为pending
    self.onFulFilledCallbacks=[]//保存成功状态的回调
    self.onRejectedCallbacks=[]//保存失败状态的回调
    // 定义成功函数
    function resolve(value){
        // 传递最内层嵌套的resolve的参数值给最外层
        if(value instanceof Promise_){
            return value.then(resolve,reject)
        }
        if(self.status==PENDING){
            self.status=FULFILLED//改变promise的状态为成功态
            self.value=value //保存成功的值
            // 如果promise中的是异步的函数，onFulFilledCallbacks会有元素,如果是同步的就为空
            self.onFulFilledCallbacks.forEach(cb => cb(self.value));
        }
    }
    // 失败函数
    function reject(reason){
        if(self.status==PENDING){
            self.status=REJECTED//改变promise的状态为成功态
            self.reason=reason //保存成功的值
            self.onRejectedCallbacks.forEach(cb => cb(self.reason));
        }
    }
    try {
        // 执行执行器函数(回调),传入已经定义的成功跟失败函数
        excutor(resolve,reject)
    } catch (error) {
        reject(error)
    }
}
function resolvePromise(promise2,x,resolve,reject){
    //如果x跟返回的promise指向相同，那么x的状态永远是pending或者reject，无法是fulfilled
    if(promise2===x){
        reject(new TypeError("循环引用"))
    }
    let called=false;//promise2是否已经resolve或reject了
    //如果x是返回的Promise实例，那就调用x的then方法，等待x执行成功，
    if(x instanceof Promise_){
        // 上一个resolve如果参数是promise实例，那么获取值的过程就是异步的，
        // 所以这里等待上一步的resolve完成，继续解析返回值，因为还可能是promise实例
        x.then(function(y){
            resolvePromise(promise2,y,resolve,reject)
        },reject)
    }
    // 用户返回的是其他数据类型，而且带有then方法
    if(x!=null&&typeof x=="object"||typeof x=="function"){
        try {
            // 我们的promise跟别的promise进行交互,尽量最大可能行的允许别人乱写
            let then=x.then;//可能因为是getter造成获取的时候出错
            if(typeof then=="function"){
                then.call(x,function(y){
                    //如果promise2已经成功或者失败了，就不用在处理了
                    if(called) return;
                    called=true
                    resolvePromise(promise2,y,resolve,reject)
                },function(e){
                    //如果promise2已经成功或者失败了，就不用在处理了
                    if(called) return;
                    called=true
                    reject(e)
                })
            }else{
                // 如果then不是函数，说明x的then属性不能调用，直接把x当成值resolve
                resolve(x)
            }
        } catch (error) {
            //如果promise2已经成功或者失败了，就不用在处理了
            if(called) return;
            called=true
            reject(error)
        }

    }else{//返回的是普通值，用x的去调用promise2的resolve，向下传递x值
        resolve(x)
    }
}

// then方法
Promise_.prototype.then=function(fulfilled,rejected){
    let self =this
    let promise2;
    // 判断传入的参数类型，统一处理为函数
    fulfilled=typeof fulfilled=="function"?fulfilled:value=>value;
    rejected=typeof rejected=="function"?rejected:reason=>{throw reason};

    if(self.status==FULFILLED){
        // 每次成功态都返回新的promise
        return promise2=new Promise_(function(resolve,reject){
            setTimeout(function(){
                try {
                    let x=fulfilled(self.value)
                    // 如果获取到了返回值x，会走解析promise过程
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    // 如果执行成功回调过程中出错，抛出错误
                    reject(error)
                }
            })
        })
    }
    if(self.status==REJECTED){
        return promise2=new Promise_(function(resolve,reject){
            setTimeout(function(){
                try {
                    let x=rejected(self.reason)
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
    if(self.status==PENDING){
        return promise2=new Promise_(function(resolve,reject){
            self.onFulFilledCallbacks.push(function(){
                setTimeout(function(){
                    try {
                        let x=fulfilled(self.value)
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            })
            self.onRejectedCallbacks.push(function(){
                setTimeout(function(){
                    try {
                        let x=rejected(self.reason)
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            })
        })
    }
}
// catch原理只传失败的回调
Promise_.prototype.catch=function(reject){
    this.then(null,reject)
}
// module.exports = Promise_