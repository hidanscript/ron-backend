DROP PROCEDURE IF EXISTS Trip_Baja_sp;
DELIMITER $$
CREATE PROCEDURE Trip_Baja_sp(IN DeleteTripID INT)

BEGIN

	DELETE FROM
		tripscompleted
	WHERE
		TripID = DeleteTripID;

	DELETE FROM
		TripsQueue
	Where
		TripID = DeleteTripID;
	
    DELETE FROM
		tripsinprocess
	WHERE
		TripID = DeleteTripID;
        
	DELETE FROM
		Trips
	WHERE
		TripID = DeleteTripID;
	
END