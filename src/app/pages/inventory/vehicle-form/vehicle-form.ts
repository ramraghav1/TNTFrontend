import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { FluidModule } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DatePicker } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { InventoryService, Vehicle } from '../inventory.service';

@Component({
    selector: 'app-vehicle-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        FluidModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        ToastModule,
        CardModule,
        DatePicker,
        TranslateModule
    ],
    providers: [MessageService],
    templateUrl: './vehicle-form.html',
    styleUrls: ['./vehicle-form.scss']
})
export class VehicleFormComponent implements OnInit {
    vehicle: Vehicle = this.initializeVehicle();
    isEditMode = false;
    vehicleId: number | null = null;
    loading = false;
    featuresText = '';

    constructor(
        private inventoryService: InventoryService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private translate: TranslateService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id'] && params['id'] !== 'new') {
                this.isEditMode = true;
                this.vehicleId = +params['id'];
                this.loadVehicle();
            }
        });
    }

    initializeVehicle(): Vehicle {
        return {
            vehicleType: '',
            model: '',
            registrationNumber: '',
            capacity: 4,
            features: [],
            pricePerDay: 0,
            driverName: '',
            driverContact: ''
        };
    }

    loadVehicle() {
        if (!this.vehicleId) return;
        
        this.loading = true;
        this.inventoryService.getVehicleById(this.vehicleId).subscribe({
            next: (data) => {
                this.vehicle = data;
                // Convert date strings to Date objects for calendar
                if (data.insuranceExpiry) {
                    this.vehicle.insuranceExpiry = data.insuranceExpiry;
                }
                if (data.permitExpiry) {
                    this.vehicle.permitExpiry = data.permitExpiry;
                }
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.messageService.add({ 
                    severity: 'error', 
                    summary: this.translate.instant('common.error') || 'Error', 
                    detail: this.translate.instant('inventory.failedToLoadVehicle')
                });
            }
        });
    }

    onSubmit() {
        if (!this.validate()) {
            return;
        }

        // Parse comma-separated features
        this.vehicle.features = this.featuresText ? this.featuresText.split(',').map(f => f.trim()).filter(f => f) : [];

        this.loading = true;
        const operation = this.isEditMode 
            ? this.inventoryService.updateVehicle(this.vehicleId!, this.vehicle)
            : this.inventoryService.createVehicle(this.vehicle);

        operation.subscribe({
            next: () => {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: this.translate.instant('common.success') || 'Success', 
                    detail: this.translate.instant(this.isEditMode ? 'inventory.vehicleUpdated' : 'inventory.vehicleCreated')
                });
                this.loading = false;
                setTimeout(() => this.router.navigate(['/inventory/vehicles']), 1000);
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.messageService.add({ 
                    severity: 'error', 
                    summary: this.translate.instant('common.error') || 'Error', 
                    detail: this.translate.instant('inventory.failedToSaveVehicle')
                });
            }
        });
    }

    validate(): boolean {
        if (!this.vehicle.vehicleType || !this.vehicle.model || !this.vehicle.registrationNumber) {
            this.messageService.add({ 
                severity: 'warn', 
                summary: this.translate.instant('common.validation') || 'Validation', 
                detail: this.translate.instant('inventory.fillRequiredFields')
            });
            return false;
        }

        if (this.vehicle.capacity <= 0 || this.vehicle.pricePerDay <= 0) {
            this.messageService.add({ 
                severity: 'warn', 
                summary: this.translate.instant('common.validation') || 'Validation', 
                detail: this.translate.instant('inventory.invalidVehicleData')
            });
            return false;
        }

        return true;
    }

    cancel() {
        this.router.navigate(['/inventory/vehicles']);
    }
}
