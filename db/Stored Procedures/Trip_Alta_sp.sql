DROP PROCEDURE IF EXISTS Trip_Alta_sp;
DELIMITER $$
CREATE PROCEDURE Trip_Alta_sp(
    IN UserID INT, 
    IN TripCountry VARCHAR(50), 
    IN TripStartLocationLatitude VARCHAR(50),
    IN TripStartLocationLongitude VARCHAR(50),
    IN TripFinalLocationLatitude VARCHAR(50),
    IN TripFinalLocationLongitude VARCHAR(50),
    IN TripDistanceKM INT,
    IN TripPriceARS DECIMAL(13, 2),
    IN TripStartStreetName varchar(100),
    IN TripFinalStreetName varchar(100)
)

BEGIN

    DECLARE last_trip_inserted_id INT DEFAULT 0;

    INSERT INTO 
        Trips
        (
            UserID, 
            Country, 
            StartLocationLatitude, 
            StartLocationLongitude,
            FinalLocationLatitude, 
            FinalLocationLongitude, 
            DistanceKM, 
            PriceARS,
            StartStreetName,
            FinalStreetName
        )
    VALUES
        (
            UserID,
            TripCountry,
            TripStartLocationLatitude,
            TripStartLocationLongitude,
            TripFinalLocationLatitude,
            TripFinalLocationLongitude,
            TripDistanceKM,
            TripPriceARS,
            TripStartStreetName,
            TripFinalStreetName
        );

    SET last_trip_inserted_id = LAST_INSERT_ID();
    
	INSERT INTO
		TripsQueue
		(
			TripID
		)
	VALUES
		(
			last_trip_inserted_id
		);
	
    SELECT
		TripID as ID
	FROM
		Trips
	Where
		TripID = last_trip_inserted_id;

END