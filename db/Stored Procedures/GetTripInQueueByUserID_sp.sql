DROP PROCEDURE IF EXISTS GetTripInQueueByUserID_sp;
DELIMITER $$
CREATE PROCEDURE GetTripInQueueByUserID_sp(IN UserID INT)

BEGIN

    SELECT
		*
	FROM
		Trips as Tr
        inner join TripsQueue as TrQu on TrQu.TripID = Tr.TripID
	WHERE
		Tr.UserID = UserID;

END