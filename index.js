const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const Person = require('./models/person');

const PORT = process.env.PORT || 3100;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms - :body -',
  ),
);

app.get('/api/info', async (req, res, next) => {
  const date = new Date();
  const people = await Person.find({}).then(persons => persons.length).catch(err => next(err))
  const info = `
  Phonebook has info for ${people} people
  </br>
  ${date}
  `;

  res.send(info);
});

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(err => next(err))
});

app.post('/api/persons', (req, res, next) => {
  const person = req.body;

  if (!person)
    return res.status(400).json({
      error: 'content missing',
    });
  if (!person.name || !person.number)
    return res.status(400).json({
      error: 'content missing',
    });

  Person.findOne({ name: person.name }).then(data => {
    if (data) {
      return res.status(409).json({
        error: 'name must be unique'
      })
    }

    const newPerson = new Person({
      ...person
    });

    newPerson.save().then(person => {
      res.json(person);
    }).catch(err => next(err))
  }).catch(err => next(err))
});

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Person.findById(id)
    .then(person => {
      if (!person) return res.status(404).end();

      res.json(person);
    })
    .catch(err => next(err))
});

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Person.findByIdAndDelete(id).then(result => {
    res.status(204).end();
  }).catch(err => next(err))
});

app.patch('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  const { number } = req.body;

  Person.findByIdAndUpdate(id, { number }).then(oldPerson => {
    res.status(201).json(oldPerson)
  }).catch(err => next(err))
})

const errorHandler = (err, req, res, next) => {

  console.error(err)
  if (err.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' })
  next(err)
}

app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
