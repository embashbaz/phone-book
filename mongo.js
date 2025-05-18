const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}


let queryRecords = false

if (process.argv.length < 4) {
    queryRecords = true
  }




const password = process.argv[2]

const name = process.argv[3]

const phoneNumber = process.argv[4]



const url = `mongodb+srv://bemeryb:${password}@cluster0.fnwzb8t.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const PhoneBookEntry = mongoose.model('PhoneBookEntry', phoneBookSchema)

if(queryRecords === false){

const entry = new PhoneBookEntry({
  name: name,
  number: phoneNumber,
})


entry.save().then(result => {
  console.log(`added ${result.name} number ${result.number} to phoneBook`)
  mongoose.connection.close()
})
}

if(queryRecords === true){
    PhoneBookEntry.find({}).then(result => {
        console.log("phone book:")
        result.forEach(entry => {
          console.log(`${entry.name}  ${entry.number}`)
        })
        mongoose.connection.close()
      })
}

