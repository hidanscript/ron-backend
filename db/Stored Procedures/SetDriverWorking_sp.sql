DROP PROCEDURE IF EXISTS SetDriverWorking_sp;
DELIMITER $$
CREATE PROCEDURE SetDriverWorking_sp(IN DriverIDProvided INT)

BEGIN
	INSERT INTO	
		driversworking
	VALUES (
		DriverID = DriverIDProvided
    );
END