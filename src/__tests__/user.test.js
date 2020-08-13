const User = require('../models/user');

test('expect to add 10 points to the user', () => {
  const user = new User(5);
  user.config();
  user.addPoints(5000);
  expect(user.points).toBe(50);
});