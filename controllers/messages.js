const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//Handle Message create on POST
exports.message_create_post = [
    // Validate and sanitize fields.
    body("title", "Title must be specified").trim().isLength({ min: 1 }).escape(),
    body("text", "Please write a message!").trim().isLength({ min: 1 }).escape(),

     // Process request after validation and sanitization.
     asyncHandler(async(req, res, next)=> {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

         // Create a Message object with escaped and trimmed data.
    const message = new Message({
        title: req.body.title,
        text: req.body.text,
      });

      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("create_message", {
          title: "Create Message",
          genre: genre,
          errors: errors.array(),
        });
        return;
      } else {
        await genre.save();
        // New message saved. Redirect to index.
        res.redirect("/");
     }}),

]