
export interface VehiclePurchase {
  id?: number; // backend primary key (sl_no)

  // Fields that match the backend Java entity exactly
  vehicleNo: string;
  bookingHire: number;
  fromLocation: string;
  toLocation: string;
  transportName: string;
  detain: string; // This should be string to match backend
  date: string;
  bookingReceivingBalanceDate?: string;
  podReceivedDate?: string;
  lorryBalancePaidDate?: string;
}

