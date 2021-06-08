const mongoose = require('mongoose');

const MONGO_URL = `mongodb+srv://groot:Fy2j$wXtNm2dAh!@cluster0.fd15m.mongodb.net/phonebook?retryWrites=true&w=majority`;

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
