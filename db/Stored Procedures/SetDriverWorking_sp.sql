DROP PROCEDURE IF EXISTS SetDriverWorking_sp;
DELIMITER $$
CREATE PROCEDURE SetDriverWorking_sp(IN DriverIDProvided INT, IN LatitudeProvided VARCHAR(150), IN LongitudeProvided VARCHAR(150))

BEGIN
	INSERT INTO	
		driversworking (DriverID, Latitude, Longitude)
	VALUES (
		DriverIDProvided,
        LatitudeProvided,
        LongitudeProvided
    );
END