const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

//Handle Message create on POST
exports.message_create_post = [
    // Validate and sanitize fields.
]