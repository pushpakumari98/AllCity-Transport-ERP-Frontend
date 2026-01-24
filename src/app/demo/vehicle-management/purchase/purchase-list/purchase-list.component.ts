import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from '../../../admin-management/confirmation-dialog/confirmation-dialog.component';
import { VehiclePurchase } from '../models/vehicle-purchase.model';
import { PurchaseModalComponent } from '../purchase-modal/purchase-modal.component';
import { PurchaseService } from '../services/purchase.service';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    ConfirmationDialogComponent,
    PurchaseModalComponent
  ],
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {

  purchases: VehiclePurchase[] = [];
  loading = false;

  showPurchaseModal = false;
  showConfirmationDialog = false;

  editMode = false;
  selectedPurchase?: VehiclePurchase;
  purchaseToDelete?: VehiclePurchase;

  constructor(
    private purchaseService: PurchaseService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPurchases();

    // Reload when navigating back to this page
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/purchase-list') {
        this.loadPurchases();
      }
    });
  }

  /* ================= LOAD DATA ================= */

  loadPurchases(): void {
    this.loading = true;

    this.purchaseService.getAllPurchases().subscribe({
      next: (res) => {
        this.purchases = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load purchases', err);
        this.snackBar.open('Failed to load purchases', 'Close', {
          duration: 3000
        });
        this.purchases = [];
        this.loading = false;
      }
    });
  }

  /* ================= NAVIGATION ================= */

  addPurchase(): void {
    this.router.navigate(['/purchases']);
  }

  updatePurchase(purchase: VehiclePurchase): void {
    this.editMode = true;
    this.selectedPurchase = purchase;
    this.showPurchaseModal = true;
  }

  /* ================= DELETE ================= */

  deletePurchase(purchase: VehiclePurchase): void {
    this.purchaseToDelete = purchase;
    this.showConfirmationDialog = true;
  }

  onConfirmDelete(): void {
    if (!this.purchaseToDelete) return;

    this.showConfirmationDialog = false;

    this.purchaseService.deletePurchase(this.purchaseToDelete.id).subscribe({
  next: () => {
    this.purchases = this.purchases.filter(
      p => p.id !== this.purchaseToDelete!.id
    );
    this.purchaseToDelete = undefined;
  }
});

  }

  onCancelDelete(): void {
    this.showConfirmationDialog = false;
    this.purchaseToDelete = undefined;
  }

  /* ================= MODAL ================= */

  closePurchaseModal(): void {
    this.showPurchaseModal = false;
    this.editMode = false;
    this.selectedPurchase = undefined;
  }

  onPurchaseSaved(purchase: VehiclePurchase): void {
    this.closePurchaseModal();
    this.loadPurchases();
  }

  /* ================= TRACK BY ================= */

  trackByPurchaseId(index: number, purchase: VehiclePurchase): number {
    return purchase.id!;
  }

  /* ================= EXPORTS ================= */

  exportToCSV(): void {
    const headers = [
      'Sl. No', 'Date', 'Vehicle No', 'Booking Hire',
      'Booking Receiving Balance Date', 'From Location',
      'To Location', 'Transport Name', 'Detain',
      'POD Received Date', 'Lorry Balance Paid Date'
    ];

    const data = this.purchases.map((p, i) => [
      i + 1,
      p.date,
      p.vehicleNo,
      p.bookingHire,
      p.bookingReceivingBalanceDate,
      p.fromLocation,
      p.toLocation,
      p.transportName,
      p.detain,
      p.podReceivedDate,
      p.lorryBalancePaidDate
    ]);

    const csv = [headers, ...data].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vehicle-purchases-list.csv';
    link.click();
  }

  exportToExcel(): void {
    import('xlsx').then(({ utils, writeFile }) => {
      const data = this.purchases.map((p, i) => ({
        'Sl. No': i + 1,
        ...p
      }));
      const ws = utils.json_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Purchases');
      writeFile(wb, 'vehicle-purchases.xlsx');
    });
  }

  exportToPDF(): void {
    import('jspdf').then(({ jsPDF }) => {
      const pdf = new jsPDF();
      pdf.text('Vehicle Purchases List', 20, 20);

      let y = 40;
      this.purchases.forEach((p, i) => {
        pdf.text(
          `${i + 1}. ${p.vehicleNo} | ₹${p.bookingHire} | ${p.transportName}`,
          20,
          y
        );
        y += 10;
      });

      pdf.save('vehicle-purchases.pdf');
    });
  }
}
