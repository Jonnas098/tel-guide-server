require('dotenv').config()
const Mongoose = require("mongoose");

const url = process.env.MONGODB_URI
console.log(`Coneccting yo ${url}`);

Mongoose.connect(url)
	.then(result => {
		console.log("Connected to Phonebook MongoDB");
	})
	.catch((error) => {
		console.log("Error connecting to MongoDB", error.message);
	})

const contactSchema = new Mongoose.Schema({
  name: String,
  number: String
})

contactSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = Mongoose.model("Contacts", contactSchema)