DROP PROCEDURE IF EXISTS GetUncompletedTripByDriverID_Cons_sp;
DELIMITER $$
CREATE PROCEDURE GetUncompletedTripByDriverID_Cons_sp(IN DriverID INT)

BEGIN

    SELECT
		*
    FROM
        Trips as TR
        left join tripsqueue as TRQU on TRQU.TripID = TR.TripID
        left join tripsinprocess as TRPR on TRPR.TripID = TR.TripID
    WHERE
        TR.DriverID = DriverID
        and (TRQU.TripQueueID is not null or TRPR.TripInProcessID is not null);

END