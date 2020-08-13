const db = require('../lib/db_connection');

class User {
    constructor(id) {
        this.id = id;
        this.points = 0;
        this.name = '';
        this.email = '';
        this.addPoints = this.addPoints.bind(this);
        this.config = this.config.bind(this);
    }

    async config() {
        try {
            const query = await db.query('SELECT * FROM User WHERE UserID = ?', this.id);
            const data = query[0];
            this.points = parseInt(data.Points);
            this.name = data.Name;
            this.email = data.Email;
        } catch(err) {}
    }

    addPoints(distance) {
        let distanceInKilometers = distance / 1000;
        // If the trips is less than 1km, set 1km by default
        distanceInKilometers = distanceInKilometers < 1 ? 1 : Math.round(distanceInKilometers);
        const points = distanceInKilometers * 10;
        this.points += points;
        db.query('UPDATE User SET Points = ? WHERE UserID = ?', [ this.points, this.id ]);
    }
}

module.exports = User;