export interface VehiclePurchaseReport {
  id?: number;
  vehicleNumber: string;
  vehicleModel: string;
  purchaseDate: string;
  price: number;
  vendorName: string;
  paymentMode: string;
}
