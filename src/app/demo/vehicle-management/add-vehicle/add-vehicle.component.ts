import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PermitLevel } from '../../../enums/permit-level.enum';
import { VehicleStatus } from '../../../enums/vehicle-status.enum';
import { VehicleType } from '../../../enums/vehicle-type.enum';
import { Vehicle } from '../../../model/vehicle.model';
import { SharedModule } from '../../../theme/shared/shared.module';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-add-vehicle',
  imports: [SharedModule],
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnInit {

  vehicleForm: FormGroup;
  isSubmitting = false;

  // Enum options for dropdowns
  permitLevelOptions = Object.values(PermitLevel);
  vehicleTypeOptions = Object.values(VehicleType);
  vehicleStatusOptions = Object.values(VehicleStatus);

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.vehicleForm = this.fb.group({
      vehicleRegNo: ['', [Validators.required, Validators.minLength(4)]],
      permitLevel: ['', Validators.required],
      driverMob: [null, [Validators.required, Validators.min(1000000000), Validators.max(9999999999)]],
      vehicleType: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.1)]],
      capacity: [null, [Validators.required, Validators.min(1)]],
      originCity: [''],
      destinationCity: [''],
      description: [''],
      vehicleStatus: [VehicleStatus.AVAILABLE]

    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.markFormGroupTouched();
      this.snackBar.open('Please fill all required fields correctly!', '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: 'error-snackbar'
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.vehicleForm.value;

    // Create vehicle object for submission
    const vehicleData: Vehicle = {
      vehicleRegNo: formValue.vehicleRegNo,
      permitLevel: formValue.permitLevel,
      driverMob: formValue.driverMob,
      vehicleType: formValue.vehicleType,
      price: formValue.price,
      capacity: formValue.capacity,
      description: formValue.description || '',
      originCity: formValue.originCity || '',
      destinationCity: formValue.destinationCity || '',
      vehicleStatus: formValue.vehicleStatus
    };

    this.vehicleService.addVehicle(vehicleData).subscribe({
      next: (response) => {
        console.log('Vehicle added successfully:', response);
        this.snackBar.open('Vehicle added successfully!', '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: 'success-snackbar'
        });
        this.isSubmitting = false;
        this.router.navigate(['/app/vehicle-list']); // Redirect to vehicle list
      },
      error: (error) => {
        console.error('Error adding vehicle:', error);
        let errorMessage = 'Error adding vehicle. Please try again!';

        if (error.status === 401) {
          errorMessage = 'Authentication required. Please login as admin.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied. Admin privileges required.';
        } else if (error.status === 400) {
          errorMessage = 'Invalid data. Please check all fields.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }

        this.snackBar.open(errorMessage, '', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: 'error-snackbar'
        });
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.vehicleForm.controls).forEach(key => {
      const control = this.vehicleForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.vehicleForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('min')) {
      if (fieldName === 'driverMob') {
        return 'Mobile number must be 10 digits';
      }
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors?.['min'].min}`;
    }
    return '';
  }

  goToVehicleList(): void {
    this.router.navigate(['/app/vehicle-list']);
  }
}
