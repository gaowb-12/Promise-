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
Promise_.prototype.then=function(fulfilled,rejected){
    let self =this
    // 判断传入的参数类型，统一处理为函数
    fulfilled=typeof fulfilled=="function"?fulfilled:value=>value;
    rejected=typeof rejected=="function"?rejected:reason=>{throw reason};

    if(self.status==FULFILLED){
        let x=fulfilled(self.value)
    }
    if(self.status==REJECTED){
        let x=rejected(self.reason)
    }
    if(self.status==PENDING){
        self.onFulFilledCallbacks.push(function(){
            let x=fulfilled(self.value)
        })
        self.onRejectedCallbacks.push(function(){
            let x=rejected(self.reason)
        })
    }
}
module.exports = Promise_