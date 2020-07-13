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

CREATE PROCEDURE GetWorkingDriversAvailable_sp()

BEGIN

    SELECT
        *
    FROM
        Driver as Dr
        inner join DriversWorking as DrWk on Dr.DriverID = DrWk.DriverID
    WHERE
        DrWk.IsOnATrip = 0;

END

CREATE PROCEDURE SetDriverOnATrip_sp(IN DriverID INT, IN TripIDProvided INT)

BEGIN

    UPDATE
		Driver as Dr
	SET
		Dr.CurrentlyInATrip = 1
	WHERE
		Dr.DriverID = DriverID;
        
	DELETE FROM
		tripsqueue
	WHERE
		TripID = TripIDProvided;
	
    INSERT INTO
		tripsinprocess(TripID)
	VALUES (
		TripIDProvided
    );
    
    UPDATE
		driversworking as DrWr
	SET
		IsOnATrip = 1
	WHERE
		DrWr.DriverID = DriverID;
        
	INSERT INTO 
		driversontrip(DriverID, TripID)
	VALUES (
		DriverID,
        TripIDProvided
    );
END

CREATE PROCEDURE SetDriverWorking_sp(IN DriverIDProvided INT)

BEGIN
	INSERT INTO	
		driversworking
	VALUES (
		DriverID = DriverIDProvided
    );
END

CREATE PROCEDURE SetTripQueueInProcess_sp(IN TripID INT)

BEGIN

    declare tripqueue_id int;
    set TripQueue_ID = (select 
							TQ.TripQueueID 
						from TripQueue as TQ 
                        inner join Trip as Tr on Tr.TripID = TQ.TripID 
                        where Tr.TripID = TripID
						);
	insert into 
		tripsinprocess
	values(
		TripID = TripID,
        Start_Date = CURRENT_TIMESTAMP
    );
    
    delete from
		TripsQueue
	Where
		TripsQueueID = TripQueue_ID;

END

CREATE PROCEDURE Trip_Alta_sp(
    IN UserID INT, 
    IN TripCountry VARCHAR(50), 
    IN TripStartLocationLatitude VARCHAR(50),
    IN TripStartLocationLongitude VARCHAR(50),
    IN TripFinalLocationLatitude VARCHAR(50),
    IN TripFinalLocationLongitude VARCHAR(50),
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
            StartLocationLatitude, 
            StartLocationLongitude,
            FinalLocationLatitude, 
            FinalLocationLongitude, 
            DistanceKM, 
            PriceARS
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

CREATE PROCEDURE Trip_Baja_sp(IN DeleteTripID INT)

BEGIN

	DELETE FROM
		tripscompleted
	WHERE
		TripID = DeleteTripID;

	DELETE FROM
		TripsQueue
	Where
		TripID = DeleteTripID;
	
    DELETE FROM
		tripsinprocess
	WHERE
		TripID = DeleteTripID;
        
	DELETE FROM
		Trips
	WHERE
		TripID = DeleteTripID;
	
END

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