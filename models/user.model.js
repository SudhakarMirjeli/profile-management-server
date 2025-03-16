const mongoose = require('mongoose')
const { Schema } = require('mongoose')

// d, name, email, address, profilePictureUrl, createdAt, updatedAt.
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    profilePictureUrl: {
        type: String
    }
}, {
    timestamps: true
})

const userModel = mongoose.model('users', userSchema)

module.exports =  userModel
