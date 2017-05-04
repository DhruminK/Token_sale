// app/models/Users.js
// IMPORTING THE NECESSARY PACKAGES -------------
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Hashids = require('hashids');
const Schema = mongoose.Schema;

hashids = new Hashids('this is my chatroom', 5);

mongoose.Promise = global.Promise;

// Define our schema 
let UserSchema = new Schema({
	local: {
		first_name: 'String',
		last_name: 'String',
		username: 'String',
		password: { type:'String', required: true, select: false},
		email: { type: 'String', required: true }
	},
	friends: [{ type: Schema.Types.ObjectId, unique: 'true' }],
	uuid: { type: 'String', unique: true}
});

// METHODS ----------------------------------------
// generating hash of the password
UserSchema.methods.generateHash = password => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
UserSchema.methods.validPassword = (password, passwordV) => {
	return bcrypt.compareSync(password, passwordV);
}

// Generating a random UUID for identification
UserSchema.methods.generateUUID = (count) => {
		let hash = hashids.encode(count);
		return hash;
}

// create the model of users
module.exports = mongoose.model('User', UserSchema);