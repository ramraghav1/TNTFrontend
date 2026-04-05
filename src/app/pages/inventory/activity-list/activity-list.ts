import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

import { InventoryService, Activity } from '../inventory.service';

@Component({
    selector: 'app-activity-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TableModule,
        ButtonModule,
        ToastModule,
        InputTextModule,
        TagModule,
        TooltipModule,
        ConfirmDialogModule,
        IconFieldModule,
        InputIconModule,
        TranslateModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './activity-list.html',
    styleUrls: ['./activity-list.scss']
})
export class ActivityListComponent implements OnInit {
    activities: Activity[] = [];
    loading = false;
    includeInactive = false;
    @ViewChild('filterInput') filterInput!: ElementRef;

    constructor(
        private inventoryService: InventoryService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadActivities();
    }

    loadActivities() {
        this.loading = true;
        this.inventoryService.getActivities(this.includeInactive).subscribe({
            next: (data) => {
                this.activities = data;
                this.loading = false;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'inventory.failedToLoadActivities' 
                });
            }
        });
    }

    addNew() {
        this.router.navigate(['/inventory/activities/new']);
    }

    editActivity(activityId: number) {
        this.router.navigate(['/inventory/activities/edit', activityId]);
    }

    deleteActivity(activity: Activity) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete ${activity.name}?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.inventoryService.deleteActivity(activity.id!).subscribe({
                    next: () => {
                        this.messageService.add({ 
                            severity: 'success', 
                            summary: 'Success', 
                            detail: 'inventory.activityDeleted' 
                        });
                        this.loadActivities();
                    },
                    error: (err) => {
                        console.error(err);
                        this.messageService.add({ 
                            severity: 'error', 
                            summary: 'Error', 
                            detail: 'inventory.failedToDeleteActivity' 
                        });
                    }
                });
            }
        });
    }

    activateActivity(activityId: number) {
        this.inventoryService.activateActivity(activityId).subscribe({
            next: () => {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Success', 
                    detail: 'inventory.activityActivated' 
                });
                this.loadActivities();
            },
            error: (err) => {
                console.error(err);
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'inventory.failedToActivateActivity' 
                });
            }
        });
    }

    getStatusSeverity(isActive: boolean): 'success' | 'danger' {
        return isActive ? 'success' : 'danger';
    }

    getDifficultySeverity(difficulty: string): 'success' | 'warn' | 'danger' {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'success';
            case 'moderate': return 'warn';
            case 'hard': return 'danger';
            default: return 'warn';
        }
    }

    formatEquipment(equipment: string[]): string {
        if (!equipment || equipment.length === 0) return '-';
        return equipment.slice(0, 2).join(', ') + (equipment.length > 2 ? ` +${equipment.length - 2}` : '');
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: any) {
        table.clear();
        if (this.filterInput) {
            this.filterInput.nativeElement.value = '';
        }
    }
}
