// Model for the users
module.exports = (function usersSchema () {

	var mongoose = require('../db').mongoose;

	var schema = {
		username: {type: String, required: true},
		email: {type: String, required: true},
		password: {type: String, required: true},
        hashKey: {type: String,required: true},
        age: {type: String,required: true},
        number: {type: String,required: true},
        state: {type: String,required: true},
        city: {type: String,required: true},
        imageURL: {type: String},
        verificationCode: {type: String},
        friends: [{type:String}],
        comments:[{type:String}],
        checkIns:[{type:String}],
        images:[{type:String}]
	};

    var collectionName = 'users';
    var usersSchema = mongoose.Schema(schema);
    var users = mongoose.model(collectionName, usersSchema);

    return users;
})();