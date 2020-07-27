DROP PROCEDURE IF EXISTS GetDriverById_sp;
DELIMITER $$
CREATE PROCEDURE GetDriverById_sp(IN DriverIDProvided INT)

BEGIN
	SELECT
		DR.DriverID,
        DR.Email,
        DR.Password,
        DR.DNI,
        DR.DNIFrontImageURL,
        DR.DNIBackImageURL,
		DR.Name,
        DR.Cellphone,
        DR.CurrentLocationLatitude,
        DR.CurrentLocationLongitude,
        DR.Country,
        DR.DriverApproved,
        DR.Trips,
        DR.CurrentlyInATrip,
        DR.Deleted,
        DR.Created_at,
        DR.Updated_at,
        DR.Deleted_at,
        DrWr.DriverID as DriverIDWorking
	FROM
		Driver as DR
        left join DriversWorking as DrWr on DrWr.DriverID = DR.DriverID
	WHERE
		DR.DriverID = DriverIDProvided;
END