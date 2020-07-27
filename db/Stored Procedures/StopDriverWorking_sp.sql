DROP PROCEDURE IF EXISTS StopDriverWorking_sp;
DELIMITER $$
CREATE PROCEDURE StopDriverWorking_sp(IN DriverIDProvided INT)

BEGIN
	DELETE FROM
		driversworking
	WHERE
		DriverID = DriverIDProvided;
END