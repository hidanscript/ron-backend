DROP PROCEDURE IF EXISTS CompleteTrip_sp;
DELIMITER $$
CREATE PROCEDURE CompleteTrip_sp(IN TripIDProvided INT, IN DriverIDProvided INT)

BEGIN

    DELETE FROM
		tripsqueue
	WHERE
		TripID = TripIDProvided;
	
    DELETE FROM
		tripsinprocess
	WHERE
		TripID = TripIDProvided;
	
    DELETE FROM
		driversontrip
	WHERE
		DriverID = DriverIDProvided
        and TripID = TripIDProvided;
	
    UPDATE
		driversworking
	SET
		IsOnATrip = 0
	WHERE
		DriverID = DriverIDProvided;
    
    INSERT INTO
		tripscompleted
	VALUES (
		TripID = TripIDProvided
    );

END