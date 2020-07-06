USE remises_online;

CREATE TABLE User(
    UserID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
    Password VARCHAR(50) NOT NULL,
    Email VARCHAR(320) NOT NULL,
    Trips INT DEFAULT 0,
    Cellphone INT NOT NULL,
    Country VARCHAR(50) NOT NULL,
    CurrentLocation VARCHAR(150) NOT NULL,
    Deleted TINYINT DEFAULT 0,
    Created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Deleted_at TIMESTAMP NULL DEFAULT NULL
);

ALTER TABLE User
ADD CONSTRAINT email UNIQUE KEY( email );

CREATE TABLE Driver (
    DriverID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
    Password VARCHAR(50) NOT NULL,
    Email VARCHAR(320) NOT NULL,
    DNI INT NOT NULL,
    DNIFrontImageURL VARCHAR(100) NOT NULL,
    DNIBackImageURL VARCHAR(100) NOT NULL,
    Cellphone INT NOT NULL,
    Country VARCHAR(50) NOT NULL DEFAULT 'ARGENTINA',
    CurrentLocationLatitude VARCHAR(150) NOT NULL,
    CurrentLocationLongitude VARCHAR(150) NOT NULL,
    DriverApproved TINYINT NOT NULL DEFAULT 0,
    Trips INT DEFAULT 0,
    CurrentlyInATrip TINYINT NOT NULL DEFAULT 0,
    Deleted TINYINT DEFAULT 0,
    Created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Deleted_at TIMESTAMP NULL DEFAULT NULL
);

ALTER TABLE Driver
ADD CONSTRAINT email UNIQUE KEY( email );

ALTER TABLE Driver
ADD CONSTRAINT dni UNIQUE KEY( DNI );


CREATE TABLE Trips (
    TripID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    UserID INT NOT NULL,
    DriverID INT NULL DEFAULT NULL,
    Country VARCHAR(50) NOT NULL DEFAULT 'ARGENTINA',
    StartLocationLatitude VARCHAR(50) NOT NULL,
    StartLocationLongitude VARCHAR(50) NOT NULL,
    FinalLocationLatitude VARCHAR(50) NOT NULL,
    FinalLocationLongitude VARCHAR(50) NOT NULL,
    DistanceKM INT NOT NULL DEFAULT 0,
    PriceARS DECIMAL(13, 2) NOT NULL DEFAULT 0,
    Start_Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE TripsQueue (
    TripQueueID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    TripID INT NOT NULL,
    Queue_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TripID) REFERENCES Trips(TripID)
);

CREATE TABLE TripsInProcess (
    TripInProcessID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    TripID INT NOT NULL,
    Start_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TripID) REFERENCES Trips(TripID)
);

CREATE TABLE TripsCompleted (
    TripCompletedID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    TripID INT NOT NULL,
    Completion_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TripID) REFERENCES Trips(TripID)
);

CREATE TABLE DriversOnTrip(
	DriverID INT NOT NULL,
    TripID INT NULL DEFAULT 0,
    Start_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID),
    FOREIGN KEY (TripID) REFERENCES Trips(TripID)
);

CREATE TABLE DriversWorking(
	DriverID INT NOT NULL,
    IsOnATrip TINYINT NOT NULL DEFAULT 0,
    Latitude DECIMAL NOT NULL,
    Longitude DECIMAL NOT NULL,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID)
);

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

DROP PROCEDURE IF EXISTS GetWorkingDriversAvailable_sp;
DELIMITER $$
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

DROP PROCEDURE IF EXISTS SetDriverOnATrip_sp;
DELIMITER $$
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

DROP PROCEDURE IF EXISTS SetTripQueueInProcess_sp;
DELIMITER $$
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