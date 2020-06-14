DROP PROCEDURE IF EXISTS UserTripsInQueue_Cons_sp;

CREATE PROCEDURE UserTripsInQueue_Cons_sp(IN UserID INT)

BEGIN

    SELECT
        *
    FROM
        TripsInQueue as TIQ
        inner join Trips as TR on TIQ.TripID = TR.TripID
    WHERE
        TR.UserID = UserID;

END