import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { VehicleSale } from '../../vehicle-management/sales/models/vehicle-sale.model';
import { SaleService } from '../../vehicle-management/sales/services/sale.service';
import { ConfirmationDialogComponent } from '../../admin-management/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-vehicle-sales-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    ConfirmationDialogComponent
  ],
  templateUrl: './vehicle-sales-reports.component.html',
  styleUrls: ['./vehicle-sales-reports.component.scss']
})
export class VehicleSalesReportsComponent implements OnInit {

  sales: VehicleSale[] = [];
  filteredSales: VehicleSale[] = [];
  loading = false;

  selectedFilter = 'today';
  filterOptions = [
    { value: 'today', label: 'Today' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'thisYear', label: 'This Year' }
  ];

  // Stats
  totalSales = 0;
  todaySales = 0;
  weekSales = 0;
  monthSales = 0;
  yearSales = 0;

  // Delete dialog
  showConfirmationDialog = false;
  selectedSaleForDelete?: VehicleSale;

  constructor(
    private saleService: SaleService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  // ================= LOAD SALES =================
  loadSales() {
    this.loading = true;

    this.saleService.getAllSales().subscribe({
      next: (res) => {
        this.sales = res || [];
        this.calculateStats();
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.sales = [];
        this.filteredSales = [];
        this.loading = false;

        this.snackBar.open(
          'Failed to load vehicle sales data',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  // ================= DATE HELPER =================
  private parseDate(date: string): Date {
    return new Date(date + 'T00:00:00'); // SAFE LocalDate parsing
  }

  // ================= STATS =================
  calculateStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const yearStart = new Date(today.getFullYear(), 0, 1);

    this.todaySales = this.sales.filter(s =>
      this.parseDate(s.date).getTime() === today.getTime()
    ).length;

    this.weekSales = this.sales.filter(s =>
      this.parseDate(s.date) >= weekStart
    ).length;

    this.monthSales = this.sales.filter(s =>
      this.parseDate(s.date) >= monthStart
    ).length;

    this.yearSales = this.sales.filter(s =>
      this.parseDate(s.date) >= yearStart
    ).length;

    this.totalSales = this.sales.length;
  }

  // ================= FILTER =================
  applyFilter() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this.selectedFilter) {

      case 'today':
        this.filteredSales = this.sales.filter(s =>
          this.parseDate(s.date).getTime() === today.getTime()
        );
        break;

      case 'thisWeek':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        this.filteredSales = this.sales.filter(s =>
          this.parseDate(s.date) >= weekStart
        );
        break;

      case 'thisMonth':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        this.filteredSales = this.sales.filter(s =>
          this.parseDate(s.date) >= monthStart
        );
        break;

      case 'thisYear':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        this.filteredSales = this.sales.filter(s =>
          this.parseDate(s.date) >= yearStart
        );
        break;

      default:
        this.filteredSales = [...this.sales];
    }
  }

  onFilterChange() {
    this.applyFilter();
  }

  // ================= DELETE =================
  deleteSale(sale: VehicleSale) {
    this.selectedSaleForDelete = sale;
    this.showConfirmationDialog = true;
  }

  onConfirmDelete() {
    if (!this.selectedSaleForDelete) return;

    this.saleService.deleteSale(this.selectedSaleForDelete.id!).subscribe({
      next: () => {
        this.sales = this.sales.filter(
          s => s.id !== this.selectedSaleForDelete!.id
        );
        this.applyFilter();
        this.calculateStats();

        this.snackBar.open(
          'Sale deleted successfully',
          'Close',
          { duration: 3000 }
        );

        this.showConfirmationDialog = false;
        this.selectedSaleForDelete = undefined;
      },
      error: () => {
        this.snackBar.open(
          'Failed to delete sale',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  onCancelDelete() {
    this.showConfirmationDialog = false;
    this.selectedSaleForDelete = undefined;
  }

  // ================= EDIT (placeholder) =================
  editSale(sale: VehicleSale) {
    this.snackBar.open(
      'Edit sale feature coming soon (ID: ' + sale.id + ')',
      'Close',
      { duration: 3000 }
    );
  }
}
