DROP PROCEDURE IF EXISTS UserTripsInQueue_Cons_sp;
DELIMITER $$
CREATE PROCEDURE UserTripsInQueue_Cons_sp(IN UserID INT)

BEGIN

    SELECT
        *
    FROM
        TripsQueue as TIQ
        inner join Trips as TR on TIQ.TripID = TR.TripID
    WHERE
        TR.UserID = UserID;

END