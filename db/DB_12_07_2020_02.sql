ALTER TABLE `User` 
CHANGE COLUMN `Password` `Password` VARCHAR(200) NOT NULL ;

ALTER TABLE `remises_online`.`trips` 
ADD COLUMN `StartStreetName` VARCHAR(100) NULL AFTER `FinalLocationLongitude`,
ADD COLUMN `FinalStreetName` VARCHAR(100) NULL AFTER `StartStreetName`;
