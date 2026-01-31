import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
// import { NotificationService } from 'src/app/shared/services/notification.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SaleService } from '../services/sale.service';
// Note: PaymentMode enum doesn't exist in the project
// Using string literals instead - common payment modes: 'UPI', 'CASH', 'NETBANKING', 'CREDIT_CARD', 'DEBIT_CARD'
// import { VehicleService } from '../../bookings/services/booking.service';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [SharedModule, NgbDropdownModule],
  templateUrl: './sale.html',
  styleUrls: ['./sale.scss']
})
export class SaleComponent implements OnInit {
  saleForm: FormGroup;
  isEditMode = false;
  editingSale: any;

  constructor(private fb: FormBuilder, private saleService: SaleService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar, // private notificationService: NotificationService
  ) {
    this.saleForm = this.fb.group({
      vehicleRefId: [1, Validators.required], // Temporary - should come from vehicle selection
      date: ['', Validators.required],
      lorryNumber: ['', Validators.required],  //lorryNumber
      weight: [0, [Validators.required, Validators.min(1)]],
      lorryHire: [0, [Validators.required, Validators.min(1)]],
      commission: [0, [Validators.required, Validators.min(0)]],
      bility: [0, [Validators.required, Validators.min(0)]],
      paymentMode: ['UPI', Validators.required],
      petrolPump: [''],
      totalAdvance: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    // Check if there's sale data passed for editing
    if (history.state && history.state.sale) {
      this.isEditMode = true;
      this.editingSale = history.state.sale;
      this.saleForm.patchValue(this.editingSale);
    }
  }

 onSubmit(): void {
  if (this.saleForm.invalid) {
    this.snackBar.open(
      'Please fill all required fields correctly.',
      'Close',
      { duration: 3000 }
    );
    return;
  }

  const formData = this.saleForm.value;

  const request$ = this.isEditMode
    ? this.saleService.updateSale({ ...formData, id: this.editingSale.id })
    : this.saleService.addSale(formData);

  request$.subscribe({
    next: () => {
      this.snackBar.open(
        this.isEditMode ? 'Sale updated successfully!' : 'Vehicle sold successfully!',
        'Close',
        { duration: 3000 }
      );

      this.router.navigate(['/app/vehicle-sales-reports']);
    },
    error: () => {
      this.snackBar.open(
        'Failed to save sale',
        'Close',
        { duration: 3000 }
      );
    }
  });
}


  private generateVehicleId(): string {
    // Generate vehicle ID in format VH-XXXXXXXX (8 uppercase chars from UUID)
    // This matches the backend @PrePersist logic in VehicleSale entity
    const uuid = crypto.randomUUID();
    const vehicleId = 'VH-' + uuid.substring(0, 8).toUpperCase();

    // Check if this ID already exists and regenerate if needed
    const existingSales = this.getExistingSales();
    const existingIds = existingSales.map(sale => sale.vehicleId);

    // Keep generating until we get a unique ID
    if (existingIds.includes(vehicleId)) {
      return this.generateVehicleId(); // Recursive call for uniqueness
    }

    return vehicleId;
  }

  private getExistingSales(): any[] {
    const stored = localStorage.getItem('userSales');
    return stored ? JSON.parse(stored) : [];
  }

  private saveSaleToLocalStorage(saleData: any) {
    const existingSales = this.getExistingSales();
    existingSales.push(saleData);
    localStorage.setItem('userSales', JSON.stringify(existingSales));
    console.log('Sale saved to localStorage:', saleData);
  }



  viewSoldVehiclesList() {
    this.router.navigate(['/app/vehicle-sales-list']);
  }
}

