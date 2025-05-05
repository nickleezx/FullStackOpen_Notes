const mongoose = require('mongoose');

if (process.argv.length < 3){
    console.log('give password as arguement');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://nicklee2345:${password}@cluster0.w6n8hri.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema);

const note = new Note({
    content: 'HTML is easy',
    important: true,
})

// note.save().then(result => {
//     console.log('Note saved');
//     mongoose.connection.close()
// })

Note.find({important: true,}).then(result => {
    result.forEach(note => {
        console.log(note)
    });
    mongoose.connection.close();
})