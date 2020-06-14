const { userIsOnATrip } = require('../validation');

test('looks if the user is in tripqueue', () => {
    const userid = 100;
    expect(userIsOnATrip(userid)).toBe(false);
});