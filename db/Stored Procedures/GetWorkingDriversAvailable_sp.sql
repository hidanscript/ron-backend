DROP PROCEDURE IF EXISTS GetWorkingDriversAvailable_sp;
DELIMITER $$
CREATE PROCEDURE GetWorkingDriversAvailable_sp()

BEGIN

    SELECT
        *
    FROM
        Driver as Dr
        inner join DriversWorking as DrWk on Dr.DriverID = DrWk.DriverID
    WHERE
        DrWk.IsOnATrip = 0;

END