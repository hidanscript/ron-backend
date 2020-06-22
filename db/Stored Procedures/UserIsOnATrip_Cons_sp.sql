DROP PROCEDURE IF EXISTS UserIsOnATrip_Cons_sp;
DELIMITER $$
CREATE PROCEDURE UserIsOnATrip_Cons_sp(IN UserID INT)

BEGIN

    SELECT
        Us.UserID
    FROM
        TripsQueue as TIQ
        inner join Trips as TR on TIQ.TripID = TR.TripID
        inner join User as Us on Us.UserID = TR.UserID
    WHERE
        TR.UserID = UserID;

END