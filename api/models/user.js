const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { 
        type: String, 
        required: true, 
        
        //unique: true,//app crashed
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    repeatPaswword : { type: String},
    name : { type: String, required: true},
    surNames : { type: String, required: true},
    country : {type: String},
    birthday : {type: String, required: true}
});

module.exports = mongoose.model('User', userSchema);