import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { VehiclePurchase } from '../../vehicle-management/purchase/models/vehicle-purchase.model';
import { VehiclePurchaseReport } from '../models/vehicle-purchase-report.model';
import { PurchaseService } from '../../vehicle-management/purchase/services/purchase.service';

@Component({
  selector: 'app-vehicle-purchase-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  templateUrl: './vehicle-purchase-reports.component.html',
  styleUrls: ['./vehicle-purchase-reports.component.scss']
})
export class VehiclePurchaseReportsComponent implements OnInit {

  purchases: VehiclePurchase[] = [];
  filteredPurchases: VehiclePurchase[] = [];
  loading = false;
  selectedFilter = 'today';
  filterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'thisYear', label: 'This Year' }
  ];

  // Stats
  totalPurchases = 0;
  todayPurchases = 0;
  weekPurchases = 0;
  monthPurchases = 0;
  yearPurchases = 0;
  totalPurchaseValue = 0;
  todayPurchaseValue = 0;
  weekPurchaseValue = 0;
  monthPurchaseValue = 0;
  yearPurchaseValue = 0;

  // Modal properties
  showConfirmationDialog = false;
  selectedPurchaseForDelete?: any;

  constructor(private purchaseService: PurchaseService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases() {
    this.loading = true;
    this.purchaseService.getAllPurchases().subscribe({
      next: (res) => {
        console.log("PURCHASE REPORTS:", res);
        this.purchases = res || [];
        this.calculateStats();
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error("Error fetching purchases:", err);
        this.purchases = [];
        this.loading = false;
        this.snackBar.open('Error loading purchase data', '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
  }


  calculateStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const yearStart = new Date(today.getFullYear(), 0, 1);

    this.todayPurchases = this.purchases.filter(p => {
      const purchaseDate = new Date(p.date);
      purchaseDate.setHours(0, 0, 0, 0);
      return purchaseDate.getTime() === today.getTime();
    }).length;

    this.weekPurchases = this.purchases.filter(p => {
      const purchaseDate = new Date(p.date);
      purchaseDate.setHours(0, 0, 0, 0);
      return purchaseDate >= weekStart;
    }).length;

    this.monthPurchases = this.purchases.filter(p => {
      const purchaseDate = new Date(p.date);
      purchaseDate.setHours(0, 0, 0, 0);
      return purchaseDate >= monthStart;
    }).length;

    this.yearPurchases = this.purchases.filter(p => {
      const purchaseDate = new Date(p.date);
      purchaseDate.setHours(0, 0, 0, 0);
      return purchaseDate >= yearStart;
    }).length;

    this.totalPurchases = this.purchases.length;

    // Calculate values using bookingHire instead of price
    this.todayPurchaseValue = this.purchases.filter(p => {
      const purchaseDate = new Date(p.date);
      purchaseDate.setHours(0, 0, 0, 0);
      return purchaseDate.getTime() === today.getTime();
    }).reduce((sum, p) => sum + p.bookingHire, 0);

    this.weekPurchaseValue = this.purchases.filter(p => {
      const purchaseDate = new Date(p.date);
      purchaseDate.setHours(0, 0, 0, 0);
      return purchaseDate >= weekStart;
    }).reduce((sum, p) => sum + p.bookingHire, 0);

    this.monthPurchaseValue = this.purchases.filter(p => {
      const purchaseDate = new Date(p.date);
      purchaseDate.setHours(0, 0, 0, 0);
      return purchaseDate >= monthStart;
    }).reduce((sum, p) => sum + p.bookingHire, 0);

    this.yearPurchaseValue = this.purchases.filter(p => {
      const purchaseDate = new Date(p.date);
      purchaseDate.setHours(0, 0, 0, 0);
      return purchaseDate >= yearStart;
    }).reduce((sum, p) => sum + p.bookingHire, 0);

    this.totalPurchaseValue = this.purchases.reduce((sum, p) => sum + p.bookingHire, 0);
  }

  applyFilter() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filterDate: Date;

    switch (this.selectedFilter) {
      case 'today':
        filterDate = today;
        this.filteredPurchases = this.purchases.filter(p => {
          const purchaseDate = new Date(p.date);
          purchaseDate.setHours(0, 0, 0, 0);
          return purchaseDate.getTime() === filterDate.getTime();
        });
        break;
      case 'thisWeek':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        this.filteredPurchases = this.purchases.filter(p => {
          const purchaseDate = new Date(p.date);
          purchaseDate.setHours(0, 0, 0, 0);
          return purchaseDate >= weekStart;
        });
        break;
      case 'thisMonth':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        this.filteredPurchases = this.purchases.filter(p => {
          const purchaseDate = new Date(p.date);
          purchaseDate.setHours(0, 0, 0, 0);
          return purchaseDate >= monthStart;
        });
        break;
      case 'thisYear':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        this.filteredPurchases = this.purchases.filter(p => {
          const purchaseDate = new Date(p.date);
          purchaseDate.setHours(0, 0, 0, 0);
          return purchaseDate >= yearStart;
        });
        break;
      default:
        this.filteredPurchases = [...this.purchases];
    }
  }

  onFilterChange() {
    this.applyFilter();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  getFilterLabel(filter: string): string {
    const option = this.filterOptions.find(opt => opt.value === filter);
    return option ? option.label : 'All Time';
  }

  getPaymentMethods(): { method: string; count: number }[] {
    // Since we don't have paymentMode in the backend entity, we'll return empty array
    return [];
  }

  getTotalValue(): number {
    return this.filteredPurchases.reduce((sum, purchase) => sum + purchase.bookingHire, 0);
  }

  // Export methods
  exportToCSV() {
    if (this.filteredPurchases.length === 0) {
      this.snackBar.open('No data to export', '', { duration: 3000 });
      return;
    }

    const data = this.filteredPurchases.map(purchase => [
      purchase.id || '',
      purchase.vehicleNo || '',
      purchase.fromLocation || '',
      purchase.toLocation || '',
      purchase.transportName || '',
      purchase.bookingHire || '',
      purchase.detain || '',
      purchase.date || ''
    ]);

    const headers = ['ID', 'Vehicle No', 'From Location', 'To Location', 'Transport Name', 'Booking Hire', 'Detain', 'Date'];
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vehicle-purchase-reports.csv';
    link.click();

    this.snackBar.open('CSV exported successfully!', '', { duration: 3000 });
  }

  exportToExcel() {
    if (this.filteredPurchases.length === 0) {
      this.snackBar.open('No data to export', '', { duration: 3000 });
      return;
    }

    import('xlsx').then(({ utils, writeFile }) => {
      const worksheet = utils.json_to_sheet(this.filteredPurchases);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Purchase Reports');
      writeFile(workbook, 'vehicle-purchase-reports.xlsx');
      this.snackBar.open('Excel exported successfully!', '', { duration: 3000 });
    }).catch(error => {
      console.error('Excel export error:', error);
      this.snackBar.open('Error exporting to Excel. Please try again.', '', { duration: 3000 });
    });
  }

  exportToPDF() {
    if (this.filteredPurchases.length === 0) {
      this.snackBar.open('No data to export', '', { duration: 3000 });
      return;
    }

    import('jspdf').then(({ jsPDF }) => {
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text('AllCity Transport - Vehicle Purchase Reports', 20, 20);
      let y = 40;
      pdf.setFontSize(12);
      pdf.text('ID | Vehicle No | From | To | Transport | Booking Hire | Detain | Date', 20, y);
      y += 20;
      this.filteredPurchases.forEach(purchase => {
        pdf.text(`${purchase.id} | ${purchase.vehicleNo} | ${purchase.fromLocation} | ${purchase.toLocation} | ${purchase.transportName} | ₹${purchase.bookingHire} | ${purchase.detain} | ${purchase.date}`, 20, y);
        y += 10;
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
      });
      pdf.save('vehicle-purchase-reports.pdf');
      this.snackBar.open('PDF exported successfully!', '', { duration: 3000 });
    }).catch(error => {
      console.error('PDF export error:', error);
      this.snackBar.open('Error exporting to PDF. Please try again.', '', { duration: 3000 });
    });
  }

  exportToDocx() {
    if (this.filteredPurchases.length === 0) {
      this.snackBar.open('No data to export', '', { duration: 3000 });
      return;
    }

    try {
      const htmlContent = `
        <html>
          <head><title>AllCity Transport - Vehicle Purchase Reports</title></head>
          <body>
            <h1>AllCity Transport - Vehicle Purchase Report</h1>
            <table border="1" style="border-collapse: collapse;">
              <tr>
                <th>ID</th><th>Vehicle No</th><th>From Location</th><th>To Location</th><th>Transport Name</th><th>Booking Hire</th><th>Detain</th><th>Date</th>
              </tr>
              ${this.filteredPurchases.map(p => `<tr><td>${p.id}</td><td>${p.vehicleNo}</td><td>${p.fromLocation}</td><td>${p.toLocation}</td><td>${p.transportName}</td><td>₹${p.bookingHire}</td><td>${p.detain}</td><td>${p.date}</td></tr>`).join('')}
            </table>
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'vehicle-purchase-reports.doc';
      link.click();

      this.snackBar.open('DOCX exported successfully!', '', { duration: 3000 });
    } catch (error) {
      console.error('DOCX export error:', error);
      this.snackBar.open('Error exporting to DOCX. Please try again.', '', { duration: 3000 });
    }
  }

  printPurchases() {
    const printHtml = `
      <div style="position: relative; background-image: url('assets/logo/allcity-transport-logo.svg'); background-repeat: no-repeat; background-position: center; background-size: 500px 500px; opacity: 0.08;">
        <div style="position: relative; z-index: 2; background: white; padding: 20px;">
          <h1>AllCity Transport - Vehicle Purchase Reports</h1>
          <p><strong>Filter:</strong> ${this.getFilterLabel(this.selectedFilter)}</p>
          <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="border: 1px solid #ddd; padding: 8px;">ID</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Vehicle No</th>
                <th style="border: 1px solid #ddd; padding: 8px;">From Location</th>
                <th style="border: 1px solid #ddd; padding: 8px;">To Location</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Transport Name</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Booking Hire</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Detain</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
              </tr>
            </thead>
            <tbody>
              ${this.filteredPurchases.map(p => `<tr><td style="border: 1px solid #ddd; padding: 8px;">${p.id}</td><td style="border: 1px solid #ddd; padding: 8px;">${p.vehicleNo}</td><td style="border: 1px solid #ddd; padding: 8px;">${p.fromLocation}</td><td style="border: 1px solid #ddd; padding: 8px;">${p.toLocation}</td><td style="border: 1px solid #ddd; padding: 8px;">${p.transportName}</td><td style="border: 1px solid #ddd; padding: 8px;">₹${p.bookingHire}</td><td style="border: 1px solid #ddd; padding: 8px;">${p.detain}</td><td style="border: 1px solid #ddd; padding: 8px;">${p.date}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
      printWindow.print();
    }
  }

  // Edit and Delete methods
  editPurchase(purchase: any) {
    // For demo purposes, show a message that edit functionality is available
    this.snackBar.open('Edit functionality would open a purchase modal here', '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
    console.log('Edit purchase:', purchase);
  }

  deletePurchase(purchase: any) {
    this.selectedPurchaseForDelete = purchase;
    this.showConfirmationDialog = true;
  }

  onConfirmDelete() {
    if (this.selectedPurchaseForDelete) {
      // For demo purposes, remove from local array
      this.purchases = this.purchases.filter(p => p.id !== this.selectedPurchaseForDelete!.id);
      this.filteredPurchases = this.filteredPurchases.filter(p => p.id !== this.selectedPurchaseForDelete!.id);
      this.snackBar.open('Purchase deleted successfully', '', { duration: 3000 });
      this.calculateStats(); // Recalculate stats after deletion
    }
    this.showConfirmationDialog = false;
  }

  onCancelDelete() {
    this.showConfirmationDialog = false;
    this.selectedPurchaseForDelete = undefined;
  }
}
