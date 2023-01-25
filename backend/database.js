const mongoose = require('mongoose')
const mongoURI = "mongodb://localhost:27017/Shifa?tls=false&readPreference=primary&directConnection=true"
function connectToMongo() {
    mongoose.connect(mongoURI, () => {
        console.log(`connected to mongo successfully.`)
    })
}
module.exports = connectToMongo