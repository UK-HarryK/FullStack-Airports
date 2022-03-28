function helper(obj){
    for(let key in obj){
        if(obj[key] instanceof Map){
            obj[key] = Object.fromEntries(obj[key])
        }
    }
    return obj
}

module.exports = {helper}