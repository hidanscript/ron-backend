const { userIsOnATrip } = require('../validation');
const Axios = require('axios');
const io = require('socket.io-client');

const connection = io('http://192.168.0.53:4000');

test('Creates and notifies drivers a new trip', () => {
    const tripData = {
        userid: 10,
        startLocation: {
            latitude: -34.535726,
            longitude:  -58.6998642
        },
        finalLocation: {
            latitude: -34.535726,
            longitude:  -58.6998642
        },
        country: 'Argentina',
        startStreetName: 'Italia 130',
        finalStreetName: 'España 441'
    }
    Axios.post('/api/trip/test', tripData)
        .then(result => {
            console.log(result.data)
        })
    connection.emit('USER_CONNECTED', { userId: 10, name: 'David' });
});