import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleSale } from '../models/vehicle-sale.model';

@Injectable({ providedIn: 'root' })
export class SaleService {

  private baseUrl = 'https://allcity-transport-erp.onrender.com/api';

  constructor(private http: HttpClient) {}

  // ================= ADD SALE (DB) =================
  addSale(data: any, document?: File): Observable<VehicleSale> {
    const formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    if (document) {
      formData.append('document', document);
    }

    return this.http.post<VehicleSale>(
      `${this.baseUrl}/vehicle-sales`,
      formData
    );
  }

  // ================= GET ALL SALES (DB) =================
  getAllSales(): Observable<VehicleSale[]> {
    return this.http.get<VehicleSale[]>(
      `${this.baseUrl}/getallsoldvehicle`
    );
  }

  // ================= UPDATE SALE (DB) =================
  updateSale(id: number, sale: any): Observable<VehicleSale> {
    return this.http.put<VehicleSale>(
      `${this.baseUrl}/${id}`,
      sale
    );
  }

  // ================= DELETE SALE (DB) =================
  deleteSale(id: number): Observable<string> {
    return this.http.delete<string>(
      `${this.baseUrl}/${id}`
    );
  }
}
