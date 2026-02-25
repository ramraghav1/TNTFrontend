import { Component,ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe, CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ViewChild } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield'; 
import { InputIconModule } from 'primeng/inputicon';
// Removed invalid import for SortIconModule
@Component({
  selector: 'app-transaction-report',
  standalone: true,
  imports: [FormsModule, DatePipe, CommonModule, ButtonModule, TableModule,
    InputTextModule,
    TooltipModule, IconFieldModule, InputIconModule],
  templateUrl: './transaction-report.html',
  styleUrl: './transaction-report.scss'
})
export class TransactionReport {
  @ViewChild('dt') dt!: Table;
  fromDate: string = '';
  toDate: string = '';
  transactions: any[] = [];
  loading = false;
  filterInput!: { nativeElement: { value: string } };

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  fetchTransactions() {
    this.loading = true;
    const params = {
      fromDate: this.fromDate,
      toDate: this.toDate
    };
    this.http.get<any[]>(`${environment.apiBaseUrl}/Transaction/list`, { params })
      .subscribe({
        next: (res) => {
          this.transactions = res;
          this.loading = false;
          this.cd.detectChanges(); 
        },
        error: () => {
          this.transactions = [];
          this.loading = false;
          this.cd.detectChanges(); 
        }
      });
  }
  applyGlobalFilter(value: string): void {
    this.dt.filterGlobal(value, 'contains');
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