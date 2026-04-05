import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { FluidModule } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

import { InventoryService, Guide } from '../inventory.service';

@Component({
    selector: 'app-guide-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        FluidModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        TextareaModule,
        ToastModule,
        CardModule,
        TranslateModule
    ],
    providers: [MessageService],
    templateUrl: './guide-form.html',
    styleUrls: ['./guide-form.scss']
})
export class GuideFormComponent implements OnInit {
    guide: Guide = this.initializeGuide();
    isEditMode = false;
    guideId: number | null = null;
    loading = false;
    languagesText = '';

    constructor(
        private inventoryService: InventoryService,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            if (params['id'] && params['id'] !== 'new') {
                this.isEditMode = true;
                this.guideId = +params['id'];
                this.loadGuide();
            }
        });
    }

    initializeGuide(): Guide {
        return {
            fullName: '',
            contactNumber: '',
            emailAddress: '',
            experienceYears: 0,
            languages: [],
            specialization: '',
            certifications: '',
            pricePerDay: 0,
            rating: 0,
            bio: '',
            photo: ''
        };
    }

    loadGuide() {
        if (!this.guideId) return;
        
        this.loading = true;
        this.inventoryService.getGuideById(this.guideId).subscribe({
            next: (data) => {
                this.guide = data;
                this.languagesText = data.languages?.join(', ') || '';
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'inventory.failedToLoadGuide' 
                });
            }
        });
    }

    onSubmit() {
        if (!this.validate()) {
            return;
        }

        // Parse comma-separated languages
        this.guide.languages = this.languagesText ? this.languagesText.split(',').map(l => l.trim()).filter(l => l) : [];

        this.loading = true;
        const operation = this.isEditMode 
            ? this.inventoryService.updateGuide(this.guideId!, this.guide)
            : this.inventoryService.createGuide(this.guide);

        operation.subscribe({
            next: () => {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: this.isEditMode ? 'inventory.guideUpdated' : 'inventory.guideCreated' 
                });
                this.loading = false;
                setTimeout(() => this.router.navigate(['/inventory/guides']), 1000);
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'inventory.failedToSaveGuide' 
                });
            }
        });
    }

    validate(): boolean {
        if (!this.guide.fullName) {
            this.messageService.add({ 
                severity: 'warn', 
                summary: 'Validation', 
                detail: 'inventory.fillRequiredFields' 
            });
            return false;
        }

        if (this.guide.pricePerDay <= 0) {
            this.messageService.add({ 
                severity: 'warn', 
                summary: 'Validation', 
                detail: 'inventory.invalidGuideData' 
            });
            return false;
        }

        return true;
    }

    cancel() {
        this.router.navigate(['/inventory/guides']);
    }
}
