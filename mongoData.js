const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    channelName : String,
    conversation: [
        {
            message: String,
            timestamp: String,
            user: String,
            userImage: String
        }
    ]
})
export default mongoose.model('conversations', chatSchema)