
export interface VehiclePurchase {
  id?: number; // backend primary key

  // Purchase management properties
  date: string;
  vehicleNo: string;
  bookingHire: string;
  bookingReceivingBalanceDate?: string;
  fromLocation: string;
  toLocation: string;
  transportName: string;
  detain: string;
  podReceivedDate?: string;
  lorryBalancePaidDate?: string;

  // Vehicle purchase reports properties
  vehicleNumber: string;
  vehicleModel: string;
  purchaseDate: string;
  price: number;
  vendorName: string;
  paymentMode: string;
}

