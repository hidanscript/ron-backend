DROP PROCEDURE IF EXISTS GetUncompletedTripByUserID_Cons_sp;
DELIMITER $$
CREATE PROCEDURE GetUncompletedTripByUserID_Cons_sp(IN UserID INT)

BEGIN

    SELECT
		*
    FROM
        Trips as TR
        left join tripsqueue as TRQU on TRQU.TripID = TR.TripID
        left join tripsinprocess as TRPR on TRPR.TripID = TR.TripID
    WHERE
        TR.UserID = UserID
        and (TRQU.TripQueueID is not null or TRPR.TripInProcessID is not null);

END