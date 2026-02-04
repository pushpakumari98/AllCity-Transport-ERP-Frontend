import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleSale } from '../models/vehicle-sale.model';

@Injectable({ providedIn: 'root' })
export class SaleService {

  private apiUrl = 'https://allcity-transport-erp.onrender.com/api/vehicle-sales';

  constructor(private http: HttpClient) {}

  // ================= ADD SALE (DB) =================
 addSale(data: any, document?: File) {
  const formData = new FormData();

  // backend expects "data"
  formData.append(
    'data',
    new Blob([JSON.stringify(data)], { type: 'application/json' })
  );

  // optional file
  if (document) {
    formData.append('document', document);
  }

  return this.http.post(
    `${this.apiUrl}/vehicle-sales`,
    formData
  );
}

  // ================= GET ALL SALES (DB) =================
  getAllSales(): Observable<VehicleSale[]> {
    return this.http.get<VehicleSale[]>(this.apiUrl);
  }

  // ================= UPDATE SALE (DB) =================
  updateSale(editingSaleId: number, sale: VehicleSale): Observable<VehicleSale> {
    return this.http.put<VehicleSale>(
      `${this.apiUrl}/${sale.id}`,
      sale
    );
  }

  // ================= DELETE SALE (DB) =================
  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
