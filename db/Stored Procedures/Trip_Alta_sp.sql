DROP PROCEDURE IF EXISTS Trip_Alta_sp;
DELIMITER $$
CREATE PROCEDURE Trip_Alta_sp(
    IN UserID INT, 
    IN TripCountry VARCHAR(50), 
    IN TripStartLocation VARCHAR(50),
    IN TripFinalLocation VARCHAR(50),
    IN TripDistanceKM INT,
    IN TripPriceARS DECIMAL(13, 2)
)

BEGIN

    DECLARE last_trip_inserted_id INT DEFAULT 0;

    INSERT INTO 
        Trips
        (
            UserID, 
            Country, 
            StartLocation, 
            FinalLocation, 
            DistanceKM, 
            PriceARS
        )
    VALUES
        (
            UserID,
            TripCountry,
            TripStartLocation,
            TripFinalLocation,
            TripDistanceKM,
            TripPriceARS
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