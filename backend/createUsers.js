const mongoose = require('mongoose');
const User = require('./models/User');

mongoose
  .connect('mongodb://127.0.0.1:27017/customerDB')
  .then(async () => {
    console.log('Connected to MongoDB');

    const users = [
      {
        first_name: 'Max',
        last_name: 'Mustermann',
        email: 'max@example.com',
        password: 'password123',
      },
      {
        first_name: 'Anna',
        last_name: 'Lisa',
        email: 'anna@example.com',
        password: 'password123',
      },
      {
        first_name: 'John',
        last_name: 'Dew',
        email: 'john@example.com',
        password: 'password123',
      },
    ];

    for (let userData of users) {
      try {
        const user = new User({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          created_at: new Date(),
          updated_at: new Date(),
        });

        // Set password using virtual field
        user.password = userData.password;

        await user.save();
        console.log(`User ${userData.email} created successfully`);
      } catch (error) {
        console.error(`Error saving user ${userData.email}:`, error);
      }
    }

    mongoose.connection.close();
  })
  .catch((err) => console.error('Connection error:', err));
