import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { SelectModule } from 'primeng/select';
import { MessageService, ConfirmationService } from 'primeng/api';

import { RemittanceService, Agent, Country, CreateAgentRequest, UpdateAgentRequest } from '../remittance.service';

@Component({
    selector: 'app-agent-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        ToastModule,
        InputTextModule,
        DialogModule,
        ToggleSwitchModule,
        ConfirmDialogModule,
        TagModule,
        IconFieldModule,
        InputIconModule,
        ToolbarModule,
        SelectModule,
        FluidModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './agent-list.html',
    styleUrls: ['./agent-list.scss']
})
export class AgentList implements OnInit {
    agents: Agent[] = [];
    countries: Country[] = [];
    loading = false;
    dialogVisible = false;
    editMode = false;
    selectedItem: any = {};

    @ViewChild('filterInput') filterInput!: ElementRef;

    constructor(
        private remittanceService: RemittanceService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.loadData();
        this.loadCountries();
    }

    loadData() {
        this.loading = true;
        this.remittanceService.getAgents().subscribe({
            next: (data) => { this.agents = data; this.loading = false; },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load agents' });
                this.loading = false;
            }
        });
    }

    loadCountries() {
        this.remittanceService.getCountries().subscribe({
            next: (data) => this.countries = data.filter(c => c.isActive)
        });
    }

    openNew() {
        this.selectedItem = { name: '', countryId: null, contactPerson: '', contactEmail: '', contactPhone: '', isActive: true };
        this.editMode = false;
        this.dialogVisible = true;
    }

    editItem(item: Agent) {
        this.selectedItem = { ...item };
        this.editMode = true;
        this.dialogVisible = true;
    }

    saveItem() {
        if (this.editMode) {
            const req: UpdateAgentRequest = {
                name: this.selectedItem.name,
                countryId: this.selectedItem.countryId,
                contactPerson: this.selectedItem.contactPerson,
                contactEmail: this.selectedItem.contactEmail,
                contactPhone: this.selectedItem.contactPhone,
                isActive: this.selectedItem.isActive
            };
            this.remittanceService.updateAgent(this.selectedItem.id, req).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Agent updated' });
                    this.dialogVisible = false;
                    this.loadData();
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update' })
            });
        } else {
            const req: CreateAgentRequest = {
                name: this.selectedItem.name,
                countryId: this.selectedItem.countryId,
                contactPerson: this.selectedItem.contactPerson,
                contactEmail: this.selectedItem.contactEmail,
                contactPhone: this.selectedItem.contactPhone,
                isActive: this.selectedItem.isActive
            };
            this.remittanceService.createAgent(req).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Agent created' });
                    this.dialogVisible = false;
                    this.loadData();
                },
                error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create' })
            });
        }
    }

    deleteItem(item: Agent) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete agent "${item.name}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.remittanceService.deleteAgent(item.id).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Agent deleted' });
                        this.loadData();
                    },
                    error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete' })
                });
            }
        });
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: any) {
        table.clear();
        if (this.filterInput) this.filterInput.nativeElement.value = '';
    }
}
