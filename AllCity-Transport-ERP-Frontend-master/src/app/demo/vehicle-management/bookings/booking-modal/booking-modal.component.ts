import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BookingService } from '../services/booking.service';
import { VehicleBooking, VehicleBookingDTO } from '../models/vehicle-booking.model';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../../../model/vehicle.model';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatSnackBarModule],
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.scss']
})
export class BookingModalComponent implements OnInit, OnChanges {

  @Input() show = false;
  @Input() editMode = false;
  @Input() bookingData!: VehicleBooking;

  @Output() closeModal = new EventEmitter<void>();
  @Output() refreshList = new EventEmitter<void>();
  @Output() bookingSaved = new EventEmitter<any>();

  bookingForm!: FormGroup;

  vehicleTypes = ['LORI', 'TRUCK', 'CAR', 'VAN', 'BUS'];
  bookingStatus = ['UPCOMING', 'INPROGRESS', 'COMPLETED', 'PENDING','OVERDUE','CANCELLED'];
  vehicleStatus = ['AVAILABLE', 'IN_PROGRESS', 'COMPLETED','PENDING','OVERDUE','MAINTENANCE'];

  vehicles: Vehicle[] = [];
  loadingVehicles = false;

  constructor(private fb: FormBuilder, private bookingService: BookingService, private vehicleService: VehicleService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.initializeForm();
    this.loadVehicles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] && changes['show'].currentValue) {
      // Reset form and then patch for edit mode when modal opens
      this.bookingForm.reset({
        bookingId: '',
        vehicleId: '',
        bookingDate: '',
        bookingReceivedDate: '',
        lorryBalancePaidDate: '',
        startedFrom: '',
        destination: '',
        vehicleType: '',
        vehicleNo: '',
        driverName: '',
        bookingHire: 0,
        bookingAdvance: 0,
        bookingBalance: 0,
        vehicleStatus: 'available',
        bookingStatus: 'PENDING',
        detain: '',
        podReceived: false,
        podDocument: ''
      });

      if (this.editMode && this.bookingData) {
        this.bookingForm.patchValue(this.bookingData);
      }
    }
  }

  private initializeForm() {
    this.bookingForm = this.fb.group({
      bookingId: ['', Validators.required],
      vehicleId: ['', Validators.required],
      bookingDate: ['', Validators.required],
      bookingReceivedDate: [''],
      lorryBalancePaidDate: [''],
      startedFrom: ['', Validators.required],
      destination: ['', Validators.required],
      vehicleType: ['', Validators.required],
      vehicleNo: [''],
      driverName: ['', Validators.required],
      bookingHire: [0, Validators.required],
      bookingAdvance: [0],
      bookingBalance: [0],
      vehicleStatus: ['available', Validators.required],
      bookingStatus: ['PENDING', Validators.required],
      detain: [''],
      podReceived: [false],
      podDocument: ['']
    });
  }

  saveBooking() {
    if (this.bookingForm.invalid) return;

    const formValue = this.bookingForm.value;

    if (this.editMode) {
      // For edit mode, use the full booking object
      const bookingData = { ...this.bookingData, ...formValue };
      this.bookingService.updateBooking(bookingData).subscribe({
        next: () => {
          this.snackBar.open('Booking updated successfully!', '', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: 'success-snackbar'
          });
          this.bookingSaved.emit(bookingData);
          this.refreshList.emit();
          this.close();
        },
        error: (err) => {
          console.error('Error updating booking:', err);
          this.snackBar.open('Failed to update booking', '', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: 'error-snackbar'
          });
        }
      });
    } else {
      // For new booking, create DTO with only required fields
      const bookingDTO: VehicleBookingDTO = {
        vehicleId: parseInt(formValue.vehicleId),
        startedFrom: formValue.startedFrom,
        destination: formValue.destination,
        driverName: formValue.driverName,
        bookingHire: formValue.bookingHire,
        bookingAdvance: formValue.bookingAdvance || 0,
        bookingBalance: formValue.bookingBalance || 0
      };

      this.bookingService.addBooking(bookingDTO).subscribe({
        next: (response) => {
          this.snackBar.open('Vehicle booked successfully!', '', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: 'success-snackbar'
          });
          this.bookingSaved.emit(response);
          this.refreshList.emit();
          this.close();
        },
        error: (err) => {
          console.error('Error creating booking:', err);
          let errorMessage = 'Failed to book vehicle';
          if (err.error && err.error.message) {
            errorMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            errorMessage = err.error;
          }
          this.snackBar.open(errorMessage, '', {
            duration: 5000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: 'error-snackbar'
          });
        }
      });
    }
  }

  loadVehicles(): void {
    this.loadingVehicles = true;
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.vehicles = data;
        } else {
          this.vehicles = [];
        }
        this.loadingVehicles = false;
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.vehicles = [];
        this.loadingVehicles = false;
      }
    });
  }

  onVehicleSelected(event: any): void {
    const selectedVehicleId = event.target.value;
    const selectedVehicle = this.vehicles.find(v => v.id?.toString() === selectedVehicleId);

    if (selectedVehicle) {
      // Auto-populate fields based on selected vehicle
      this.bookingForm.patchValue({
        vehicleId: selectedVehicle.vehicleId || selectedVehicle.id,
        vehicleType: selectedVehicle.vehicleType,
        vehicleNo: selectedVehicle.vehicleRegNo,
        driverName: selectedVehicle.driverMob ? `Driver (${selectedVehicle.driverMob})` : ''
      });
    }
  }

  close() {
    this.bookingForm.reset();
    this.closeModal.emit();
  }
}
