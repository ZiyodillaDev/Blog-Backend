const bodyParser = (request)=>{
  return new Promise((resolve,reject)=>{
  try {
    request.on("data", (data)=>{
        resolve(JSON.parse(data));
    })
  } catch (error) {
    reject(error)
  }
  })
}

module.exports = bodyParser