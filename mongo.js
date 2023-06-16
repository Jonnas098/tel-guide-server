const Mongoose = require("mongoose");

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.6ldx4ji.mongodb.net/phonebook-app?retryWrites=true`

Mongoose.connect(url)

const contactSchema = new Mongoose.Schema({
	name: String,
	number: Number
})

const Contact = Mongoose.model("Contact", contactSchema)

const contact = new Contact({
	name: process.argv[3],
	number: process.argv[4]
})

const createNew = () => {
	contact.save().then(result => {
		console.log("New contact saved:", result.name, result.number);
		Mongoose.connection.close()
	})
}

const showAll = () => {
	Contact.find({}).then(result => {
		console.log("Phonebook:");
		result.forEach(contact => {
			console.log(contact.name, contact.number);
		})
		Mongoose.connection.close()
	})
}

if(process.argv.length < 3) {
	console.log("Please provide the password as an argument: node mongo.js <password>");
	process.exit(1)
} else if(process.argv.length === 3) {
	showAll()
} else if(process.argv.length > 3){
	createNew()
}
