DROP PROCEDURE IF EXISTS DriverTripInfo_Cons_sp;
DELIMITER $$
CREATE PROCEDURE DriverTripInfo_Cons_sp(IN DriverID INT)

BEGIN

    SELECT
        TR.UserID as UserID,
        TR.DistanceKM as DistanceKM,
        TR.PriceARS as PriceARS,
        TR.TripID as TripID,
        TR.StartLocationLatitude as StartLocationLatitude,
        TR.StartLocationLongitude as StartLocationLongitude,
        TR.FinalLocationLatitude as FinalLocationLatitude,
        TR.FinalLocationLongitude as FinalLocationLongitude,
        TR.Start_Date as Start_Date
    FROM
        Trip as TR
        INNER JOIN tripsinprocess as TrPr on TrPr.TripID = TR.TripID
    WHERE
        TR.DriverID = DriverID;
END