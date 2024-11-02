const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/ipfs-library'; // 请根据实际情况修改

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    cid: String,
    uploader: String,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = { Book };
