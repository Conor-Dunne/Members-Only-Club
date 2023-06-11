const User = require("../models/user");
const asyncHandler = require("express-async-handler");


exports.update_memberstatus = asyncHandler(async(req, res, next) => {
    try {
        // Find the user document by id
        const user = await User.findById(req.user._id);
    
        if (user) {
          // Update the 'isMember' field to true
          user.isMember = true;
          await user.save();
    
          return res.json({ message: 'User is now a member' });
        } else {
          return res.status(404).json({ message: 'User not found' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
});