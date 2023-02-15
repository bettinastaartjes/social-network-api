// Wrap Mongoose around local connection to MongoDB
const { connect, connection } = require('mongoose');

connect('mongodb://localhost:27017/social-network-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

//export connection
module.exports = connection;