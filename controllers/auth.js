const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { check, body, validationResult } = require('express-validator');


//Register User

exports.register_user = async(req, res, next) => {
    try {

        // Validate the request body using express-validator
        await check('password')
        .isLength({ min: 4 })
        .withMessage('Password must be at least 4 characters long')
        .run(req);
  
    await body('confirm-password')
      .equals(req.body.password)
      .withMessage('Password confirmation does not match')
      .run(req);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are validation errors, render the registration form again with error messages
      res.render('sign-up', {
        title: 'User Registration',
        user: null,
        errors: errors.array(),
      });
      return;
    }


        bcrypt.hash(req.body.password, 10, async(err, hashedpassword)=> {
            if(err) {
                return next(err);
            }
            const user = new User({
                username: req.body.username,
                password: hashedpassword
            });
            const result = await user.save();
            req.session.message = "Thank you for registering. You can now log in to your account.";
            res.redirect("/log-in");
        })
    } catch(err) {
        return next(err);
    }
}