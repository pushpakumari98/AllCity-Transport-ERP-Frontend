import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { SaleService } from '../services/sale.service';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [SharedModule, NgbDropdownModule],
  templateUrl: './sale.html',
  styleUrls: ['./sale.scss']
})
export class SaleComponent implements OnInit {

  saleForm!: FormGroup;
  isEditMode = false;
  editingSaleId!: number;

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (history.state?.sale) {
      this.isEditMode = true;
      const sale = history.state.sale;
      this.editingSaleId = sale.id;
      this.saleForm.patchValue(sale);
    }
  }

  private initForm(): void {
    this.saleForm = this.fb.group({
      date: ['', Validators.required],
      lorryNumber: ['', Validators.required],
      weight: [null, [Validators.required, Validators.min(0.01)]],
      lorryHire: [null, [Validators.required, Validators.min(0.01)]],
      commission: [0, [Validators.required, Validators.min(0)]],
      bility: [0, [Validators.required, Validators.min(0)]],
      paymentMode: ['UPI', Validators.required],
      petrolPump: [''],
      totalAdvance: [0, [Validators.required, Validators.min(0)]],
      vehicleRefId: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.saleForm.invalid) {
      this.snackBar.open(
        'Please fill all required fields correctly',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    const saleData = this.saleForm.value;

    const request$ = this.isEditMode
      ? this.saleService.updateSale(this.editingSaleId, saleData)
      : this.saleService.addSale(saleData);

    request$.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEditMode
            ? 'Sale updated successfully!'
            : 'Vehicle sale added successfully!',
          'Close',
          { duration: 3000 }
        );
        this.router.navigate(['/app/vehicle-sales-reports']);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open(
          'Failed to save sale',
          'Close',
          { duration: 3000 }
        );
      }
    });
  }

  viewSoldVehiclesList(): void {
    this.router.navigate(['/app/vehicle-sales-list']);
  }
}

