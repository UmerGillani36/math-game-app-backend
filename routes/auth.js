// auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./../db');
const router = express.Router();

// POST /signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user with email already exists
  const userWithEmail = db.get(
    'SELECT * FROM users WHERE email = ?',
    email,
    (err, row) => {
      if (row) {
        return res.status(400).json({ error: 'Email is already taken' });
      }
      if (err) {
        console.log(err);
        return res.status(500).send({ error: 'Server error' });
      }

      // Hash the password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ error: 'Server error' });
        }

        // Insert the user into the database
        const sql =
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.run(sql, [name, email, hash], (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send({ error: 'Server error' });
          }
          const sql1 = 'SELECT * FROM users WHERE email = ?';
          db.get(sql1, email, (error, data) => {
            console.log('Row: ', data);
            console.log('Error: ', error);
            const token = jwt.sign({ id: data.id }, 'secret-key');
            return res.status(201).send({ message: 'User created', token });
          });
        });
      });
    }
  );
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Query the user with the given email from the database
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, email, (err, row) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ error: 'Server error' });
    }

    if (!row) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }

    // Compare the password with the hashed password in the database
    bcrypt.compare(password, row.password, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: 'Server error' });
      }

      if (!result) {
        return res.status(401).send({ error: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: row.id }, 'secret-key');

      return res.status(200).send({ token });
    });
  });
});

module.exports = router;
