import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DriverService } from './services/driver.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../../../theme/shared/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-driver',
  imports: [
    SharedModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './driver.html',
  styleUrls: ['./driver.scss']
})
export class DriverComponent {

  driverForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private router: Router,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService
  ) {
    this.driverForm = this.fb.group({
      date: ['', Validators.required],
      vehicleNo: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/)]],
      driverName: ['', Validators.required],
      startedFrom: ['', Validators.required],
      destination: ['', Validators.required],
      carryMaterialType: ['', Validators.required],
      contactNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      address: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.driverForm.invalid) return;

    const payload = {
      ...this.driverForm.value,
      date: new Date(this.driverForm.value.date)
              .toISOString()
              .split('T')[0]
    };

    this.driverService.addDriver(payload).subscribe({
      next: () => {
        this.snackBar.open('Driver added successfully!', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });

        // Trigger notification
        this.notificationService.notifyDriverAdded(payload);

        this.router.navigate(['/app/drivers-list']);
      },

      error: () => {
        this.snackBar.open('Driver addition failed!', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        });
      }
    });
  }

  viewDriversList() {
    this.router.navigate(['/app/drivers-list']);
  }
}
