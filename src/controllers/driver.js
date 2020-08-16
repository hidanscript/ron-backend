/*
  WIP
*/
import db from '../lib/db_connection';

export default class Driver {
  constructor(id = 0) {
    this.id = id;
    this.config = this.config.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.save = this.save.bind(this);
  }

  async config() {
    try {
      const data = await db.query("CALL GetDriverById_sp(?)", driverid);
      const driver = data[0];
      if(driver) {
        this.name = driver.Name;
        this.cellphone = driver.cellphone;
        this.matricula = driver.Matricula;
        this.modeloAuto = driver.ModeloAuto;
        this.dni = driver.DNI;
        this.deleted = driver.Deleted;
        this.email = driver.Email;
        this.currentLocationLongitude = driver.CurrentLocationLongitude;
        this.currentLocationLatitude = driver.CurrentLocationLatitude;
        this.dniFrontImageUrl = driver.DNIFrontImageUR;
        this.dniBackImageUrl = driver.DNIBackImageURL;
        this.licenseUrl = driver.LicenseURL;
      }
    } catch(err) {
      // TODO Handle error
    }
  };

  async save() {
    if(this.id) {

    }
  };

  updatePosition(latitude, longitude) {
    try {
      console.log('latitude', latitude);
      console.log('longitude', longitude);
      db.query(
        "UPDATE Driver SET CurrentLocationLatitude = ?, CurrentLocationLongitude = ? WHERE DriverID = ?",
        [latitude, longitude, this.id]
      );
      return { driverid: this.id, latitude, longitude };
    } catch (error) {
      return false;
    }
  };

}