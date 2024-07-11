const mongoose = require('mongoose');
const User = require('./models/User');

mongoose
  .connect('mongodb://127.0.0.1:27017/customerDB')
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      await User.deleteMany({});
      console.log('All users deleted successfully');
    } catch (error) {
      console.error('Error deleting users:', error);
    }
    mongoose.connection.close();
  })
  .catch((err) => console.error('Connection error:', err));
