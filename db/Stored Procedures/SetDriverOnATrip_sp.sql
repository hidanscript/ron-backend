DROP PROCEDURE IF EXISTS SetDriverOnATrip_sp;
DELIMITER $$
CREATE PROCEDURE SetDriverOnATrip_sp(IN DriverID INT, IN TripIDProvided INT)

BEGIN

    UPDATE
		Driver as Dr
	SET
		Dr.CurrentlyInATrip = 1
	WHERE
		Dr.DriverID = DriverID;
        
	DELETE FROM
		tripsqueue
	WHERE
		TripID = TripIDProvided;
	
    INSERT INTO
		tripsinprocess(TripID)
	VALUES (
		TripIDProvided
    );
    
    UPDATE
		driversworking as DrWr
	SET
		IsOnATrip = 1
	WHERE
		DrWr.DriverID = DriverID;
        
	INSERT INTO 
		driversontrip(DriverID, TripID)
	VALUES (
		DriverID,
        TripIDProvided
    );
END