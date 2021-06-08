const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};
mongoose.connect(MONGO_URL, options);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

module.exports = mongoose.model('Person', personSchema);
