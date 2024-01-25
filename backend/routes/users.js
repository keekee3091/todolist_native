var express = require('express');
var router = express.Router();

const User = require('../models/users')
const { checkBody } = require('../module/checkbody')
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const defaultAvatar = 'https://res.cloudinary.com/dhsjdryol/image/upload/f_auto,q_auto/v1/samples/man-portrait.jpeg'
//Register new users
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' })
    return
  }
  const { username, email, password } = req.body

  User.findOne({ username }).then(userData => {
    if (userData === null) {
      const hash = bcrypt.hashSync(password, 10)

      const newUser = new User({
        username,
        email,
        password: hash,
        token: uid2(32),
        profilePicture: defaultAvatar
      })

      newUser.save().then(newUserData => {
        res.json({ result: true, token: newUserData.token })
      })
    } else {
      res.json({ result: false, error: 'User already exists' })
    }
  })
})

//Route to log in
router.post('/signin', (req, res) => {
  const { email, username, password, token } = req.body;

  if (!checkBody(req.body, ['password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  if (!email && !username) {
    res.json({ result: false, error: 'Email or username is required for login' });
    return;
  }

  const query = { $or: [{ email }, { username }] };

  User.findOne(query).then(identifierData => {
    if (identifierData !== null) {
      if (bcrypt.compareSync(password, identifierData.password)) {
        if (token === identifierData.token) {
          res.json({ result: true, token: identifierData.token });
        } else {
          res.json({ result: false, error: 'Invalid token' });
        }
      } else {
        res.json({ result: false, error: 'Invalid password' });
      }
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

// Get user by token
router.get('/getUserByToken/:token', async (req, res) => {
  try {
    const userToken = req.params.token;

    // Find the user by the provided token
    const user = await User.findOne({ token: userToken });

    if (!user) {
      return res.status(404).json({ result: false, error: 'User not found' });
    }

    // Remove sensitive information (e.g., password) before sending the response
    const { password, ...userData } = user._doc;

    res.json({ result: true, userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: false, error: 'Internal Server Error' });
  }
});





module.exports = router;
