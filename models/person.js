const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const MONGO_URL = process.env.MONGO_URL;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};
mongoose.connect(MONGO_URL, options);

const personSchema = new mongoose.Schema({
  name: {
    minlength: 3,
    required: true,
    type: String,
    unique: true,
  },
  number: {
    minlength: 8,
    require: true,
    type: String,
  },
});

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema);
