const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('Connecting to', url);
mongoose.connect(url)
    .then(result => {
        console.log("Connected to MongoDB");
    }).catch(e => {
        console.log("error connecting to MongoDB", e.message);
    });

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Note', noteSchema);