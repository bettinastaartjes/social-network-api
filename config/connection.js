const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI ||
    'mongodbL//127.0.0.1:27017/socialmedia', {
        userNewUrlParser: true,
        useUnifiedTopology: true,
    });

module.exports = mongoose.connection;
