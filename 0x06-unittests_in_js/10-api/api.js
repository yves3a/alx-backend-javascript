#!/usr/bin/env node

const express = require('express');

const port = 7865;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the payment system');
});

app.get('/cart/:id([0-9]+)', (req, res) => {
  const { id } = req.params;
  res.status(200).send(`Payment methods for cart ${id}`);
});

app.get('/available_payments', (req, res) => {
  res.status(200).json(
    {
      payment_methods: {
        credit_cards: true,
        paypal: false,
      },
    },
  );
});

app.post('/login', (req, res) => {
  if (!req.body) {
    res.status(401).send('Invalid credentials');
  } else {
    try {
      const { userName } = req.body;
      if (userName.length === 0) {
        res.status(401).send('Invalid credentials');
      }
      res.status(200).send(`Welcome ${userName}`);
    } catch (error) {
      res.status(401).send('Invalid credentials');
    }
  }
});

// Handle undefined routes and general 404 page returns
app.use((req, res) => {
  res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});

module.exports = app;
