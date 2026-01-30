import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver.model';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DriverService {
  private apiUrl = `${environment.apiUrl}/api/drivers`;

  constructor(private http: HttpClient) {}

  // Add driver
  addDriver(driver: Driver): Observable<Driver> {
    return this.http.post<Driver>(this.apiUrl, driver);
  }

  // Get all drivers
  getAllDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.apiUrl);
  }

  // Update driver
  updateDriver(driver: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${this.apiUrl}/${driver.id}`, driver);
  }

  // Delete driver
  deleteDriver(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Search by serial number
  getBySerialNumber(serialNo: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.apiUrl}/serial/${serialNo}`);
  }

  // Search by carry material type
  getByCarryMaterialType(carryMaterialType: string): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.apiUrl}/material/${carryMaterialType}`);
  }

  // Search by vehicle number
  getByVehicleNumber(vehicleNo: string): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.apiUrl}/vehicle/${vehicleNo}`);
  }
}
