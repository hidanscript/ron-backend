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