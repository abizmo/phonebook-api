const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 3100;
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-123456',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-123456',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-123456',
  },
];

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

app.get('/api/info', (req, res) => {
  const date = new Date();
  const people = persons.length;
  const info = `
  Phonebook has info for ${people} people
  </br>
  ${date}
  `;

  res.send(info);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

const generateId = () => parseInt(Math.random() * Math.pow(10, 8));

app.post('/api/persons', (req, res) => {
  const person = req.body;

  if (!person)
    return res.status(400).json({
      error: 'content missing',
    });
  if (!person.name || !person.number)
    return res.status(400).json({
      error: 'content missing',
    });
  if (persons.find((p) => p.name === person.name)) {
    return res.status(409).json({
      error: 'name must be unique',
    });
  }

  person.id = generateId();
  persons.push(person);
  return res.status(201).json(person);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) return res.status(404).end();

  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
