var _ = require('lodash');
var User = require('../models/user.js');
var log = require('../../dev-logger.js');
const passport = require('passport');
const auth = require('./auth.routes.js');


module.exports = function(app) {
  app.post('/signup', auth.optional, (req, res, next) => {
    const { email, empId, name, surname } = req.body;
    const password = req.body.passwords.pass;

    newUser = {
      email,
      empId,
      name,
      surname,
      password,
      role: 'user',
    };

    console.log(newUser.email);
    if(!newUser.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if(!newUser.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    if(!newUser.empId) {
      return res.status(422).json({
        errors: {
          empId: 'is required',
        }
      });
    }


    User.find({ email: newUser.email }, function(err, user) {
      if (err) {
        res.status(404).json({ info: 'Cannot check if user exists' })
      }
      if (user.length <= 0) {
        const finalUser = new User(newUser);
        finalUser.setPassword(newUser.password);
        finalUser.save().then(() => res.status(200).json(finalUser.toAuthJSON()));
      } else {
        res.status(404).json({ info: 'There is an account with this email' })
      }
    });
  });

  app.post('/login', auth.optional, (req, res, next) => {
    const { body: { user }} = req;

    if(!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if(err) {
        return next(err);
      }

      if(passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();

        return res.json(user.toAuthJSON());
      }

      return res.status(400).json(info);

    })(req, res, next);
  });

  app.post('/logout', auth.optional, (req, res) => {
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      }
      res.end()
    });
  });

  app.get('/users', auth.required, (req, res) => {
    User.find(function(err, users) {
      if(err) {
        res.status(404).json({ error: 'Cannot get users'});
      }
      if(users) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ info: 'Cannot find any users'});
      }
    })
  })
};
