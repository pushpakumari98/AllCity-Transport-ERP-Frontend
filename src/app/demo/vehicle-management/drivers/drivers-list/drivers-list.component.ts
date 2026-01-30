import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DriverService } from '../services/driver.service';
import { Driver } from '../models/driver.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../../admin-management/confirmation-dialog/confirmation-dialog.component';
import { DriverModalComponent } from '../driver-modal/driver-modal.component';

@Component({
  selector: 'app-drivers-list',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, ReactiveFormsModule, FormsModule, MatSnackBarModule, ConfirmationDialogComponent, DriverModalComponent],
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.scss']
})
export class DriversListComponent implements OnInit {

  drivers: Driver[] = [];
  loading = false;
  showConfirmationDialog = false;
  driverToDelete?: Driver;
  showDriverModal = false;
  showList = false;
  editMode = false;
  selectedDriver?: Driver;
  driverForm!: FormGroup;

  constructor(
    private driverService: DriverService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.showList = true; // Show list by default
    // Load drivers list first
    this.loadDrivers();
  }

  private initializeForm() {
    this.driverForm = this.fb.group({
      date: ['', Validators.required],
      vehicleNo: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/)]],
      driverName: [''],
      startedFrom: ['', Validators.required],
      destination: ['', Validators.required],
      carryMaterialType: ['', Validators.required],
      contactNumber: [''],
      address: ['', Validators.required]
    });
  }

  loadDrivers() {
    this.loading = true;
    this.driverService.getAllDrivers().subscribe({
      next: (res) => {
        console.log("DRIVERS BACKEND RESPONSE:", res);
        this.drivers = res;
        this.loading = false;
      },
      error: (err) => {
        console.error("Error fetching drivers:", err);
        this.loading = false;
        this.snackBar.open('Error loading drivers data', '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
  }


  addDriver() {
    // Navigate to the dedicated driver form page
    this.router.navigate(['/drivers']);
  }

  updateDriver(driver: Driver) {
    this.editMode = true;
    this.selectedDriver = driver;
    this.driverForm.patchValue(driver);
    this.showDriverModal = true;
  }

  deleteDriver(driver: Driver) {
    this.driverToDelete = driver;
    this.showConfirmationDialog = true;
  }

  onConfirmDelete() {
    if (this.driverToDelete) {
      this.showConfirmationDialog = false;
      this.driverService.deleteDriver(this.driverToDelete.id!).subscribe({
        next: () => {
          this.removeDriverFromList(this.driverToDelete!.id!);
          this.driverToDelete = undefined;
          this.snackBar.open('Driver deleted successfully!', '', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        },
        error: (err) => {
          console.error('Error deleting driver:', err);
          this.snackBar.open('Error deleting driver', '', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          this.driverToDelete = undefined;
        }
      });
    }
  }

  onCancelDelete() {
    this.showConfirmationDialog = false;
    this.driverToDelete = undefined;
  }

  private removeDriverFromList(driverId: number) {
    this.drivers = this.drivers.filter(d => d.id !== driverId);
  }

  trackByDriverId(index: number, driver: Driver): string {
    return driver.serialNo?.toString() || driver.id?.toString() || index.toString();
  }

  closeDriverModal() {
    this.showDriverModal = false;
  }

  onDriverSaved(updatedDriver: any) {
    // Close the modal and load the drivers list like bookings page
    this.showDriverModal = false;
    this.loadDrivers();
  }

  saveDriver() {
    if (this.driverForm.invalid) return;

    const payload = this.driverForm.value;
    const driverData = this.editMode ? { ...this.selectedDriver, ...payload } : payload;
    const observable = this.editMode
      ? this.driverService.updateDriver(driverData)
      : this.driverService.addDriver(driverData);

    const action = this.editMode ? 'updated' : 'added';

    observable.subscribe({
      next: () => {
        this.snackBar.open(`Driver ${action} successfully!`, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
        this.closeDriverModal();
        this.loadDrivers();
      },
      error: (err) => {
        console.error(`Error ${action} driver:`, err);
        this.snackBar.open(`Error ${action} driver`, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
  }



  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.driverForm.patchValue({ document: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  // Export methods
  exportToCSV() {
    const data = this.drivers.map(driver => [
      driver.serialNo || '',
      driver.date || '',
      driver.vehicleNo || '',
      driver.driverName || '',
      driver.startedFrom || '',
      driver.destination || '',
      driver.carryMaterialType || '',
      driver.contactNumber || '',
      driver.address || ''
    ]);

    const headers = ['Sl. No', 'Date', 'Vehicle No', 'Driver Name', 'Started From', 'To', 'Type of Material Carry', 'Contact No', 'Address'];
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'drivers-list.csv';
    link.click();
  }

  exportToExcel() {
    import('xlsx').then(({ utils, writeFile }) => {
      const worksheet = utils.json_to_sheet(this.drivers);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'Drivers');
      writeFile(workbook, 'drivers-list.xlsx');
    });
  }

  exportToPDF() {
    import('jspdf').then(({ jsPDF }) => {
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text('AllCity Transport - Drivers List', 20, 20);
      let y = 40;
      pdf.setFontSize(12);
      pdf.text('Sl.No | Driver Name | Vehicle | Contact', 20, y);
      y += 20;
      this.drivers.forEach(driver => {
        pdf.text(`${driver.serialNo} | ${driver.driverName} | ${driver.vehicleNo} | ${driver.contactNumber}`, 20, y);
        y += 10;
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
      });
      pdf.save('drivers-list.pdf');
    });
  }

  exportToDocx() {
    const htmlContent = `
      <html>
        <head><title>AllCity Transport - Drivers List</title></head>
        <body>
          <h1>AllCity Transport - Drivers Report</h1>
          <table border="1" style="border-collapse: collapse;">
            <tr>
              <th>Sl. No</th><th>Date</th><th>Vehicle No</th><th>Driver Name</th><th>Started From</th><th>To</th><th>Material Type</th><th>Contact No</th><th>Address</th>
            </tr>
            ${this.drivers.map(d => `<tr><td>${d.serialNo}</td><td>${d.date}</td><td>${d.vehicleNo}</td><td>${d.driverName}</td><td>${d.startedFrom}</td><td>${d.destination}</td><td>${d.carryMaterialType}</td><td>${d.contactNumber}</td><td>${d.address}</td></tr>`).join('')}
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'drivers-list.doc';
    link.click();
  }

  printDrivers() {
    const printHtml = `
      <div style="position: relative; background-image: url('assets/logo/allcity-transport-logo.svg'); background-repeat: no-repeat; background-position: center; background-size: 500px 500px; opacity: 0.08;">
        <div style="position: relative; z-index: 2; background: white; padding: 20px;">
          <h1>AllCity Transport - Drivers List</h1>
          <table border="1" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Sl. No</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Date</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Driver Name</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Vehicle No</th>
                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Contact No</th>
              </tr>
            </thead>
            <tbody>
              ${this.drivers.map(d => `<tr><td style="border: 1px solid #ddd; padding: 8px;">${d.serialNo}</td><td style="border: 1px solid #ddd; padding: 8px;">${d.date}</td><td style="border: 1px solid #ddd; padding: 8px;">${d.driverName}</td><td style="border: 1px solid #ddd; padding: 8px;">${d.vehicleNo}</td><td style="border: 1px solid #ddd; padding: 8px;">${d.contactNumber}</td></tr>`).join('')}
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

  viewDocument(documentData: string) {
    if (documentData) {
      window.open(documentData, '_blank');
    }
  }
}
