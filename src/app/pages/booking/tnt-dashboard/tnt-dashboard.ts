import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

import { BookingService, DashboardStats } from '../booking.service';

@Component({
    selector: 'app-tnt-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        ChartModule,
        TableModule,
        ButtonModule,
        TagModule,
        ToastModule,
        SkeletonModule,
        TooltipModule
    ],
    providers: [MessageService],
    templateUrl: './tnt-dashboard.html',
    styleUrls: ['./tnt-dashboard.scss']
})
export class TntDashboard implements OnInit {
    stats: DashboardStats | null = null;
    loading = true;

    // Chart data
    bookingChartData: any;
    bookingChartOptions: any;
    revenueChartData: any;
    revenueChartOptions: any;
    statusChartData: any;
    statusChartOptions: any;
    paymentChartData: any;
    paymentChartOptions: any;

    constructor(
        private bookingService: BookingService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats() {
        this.loading = true;
        this.bookingService.getDashboardStats().subscribe({
            next: (data) => {
                this.stats = data;
                this.buildCharts();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load dashboard data' });
                this.cdr.detectChanges();
            }
        });
    }

    private buildCharts() {
        if (!this.stats) return;

        const docStyle = getComputedStyle(document.documentElement);
        const textColor = docStyle.getPropertyValue('--p-text-color') || '#495057';
        const surfaceBorder = docStyle.getPropertyValue('--p-content-border-color') || '#dee2e6';

        // Booking trend (bar chart)
        this.bookingChartData = {
            labels: this.stats.monthlyBookings.map(m => m.month),
            datasets: [{
                label: 'Bookings',
                data: this.stats.monthlyBookings.map(m => m.count),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 6
            }]
        };
        this.bookingChartOptions = {
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: textColor, stepSize: 1 }, grid: { color: surfaceBorder } },
                x: { ticks: { color: textColor }, grid: { display: false } }
            },
            maintainAspectRatio: false
        };

        // Revenue trend (line chart)
        this.revenueChartData = {
            labels: this.stats.monthlyRevenue.map(m => m.month),
            datasets: [{
                label: 'Revenue (NPR)',
                data: this.stats.monthlyRevenue.map(m => m.amount),
                fill: true,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgb(16, 185, 129)',
                tension: 0.4,
                pointBackgroundColor: 'rgb(16, 185, 129)',
                pointRadius: 5
            }]
        };
        this.revenueChartOptions = {
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: surfaceBorder } },
                x: { ticks: { color: textColor }, grid: { display: false } }
            },
            maintainAspectRatio: false
        };

        // Status breakdown (doughnut)
        this.statusChartData = {
            labels: ['Confirmed', 'Pending', 'Draft', 'Cancelled'],
            datasets: [{
                data: [this.stats.confirmed, this.stats.pending, this.stats.draft, this.stats.cancelled],
                backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
                hoverBackgroundColor: ['#059669', '#d97706', '#2563eb', '#dc2626'],
                borderWidth: 0
            }]
        };
        this.statusChartOptions = {
            cutout: '65%',
            plugins: {
                legend: { position: 'bottom', labels: { color: textColor, usePointStyle: true, padding: 16 } }
            },
            maintainAspectRatio: false
        };

        // Payment status (doughnut)
        this.paymentChartData = {
            labels: this.stats.paymentStatusBreakdown.map(p => p.label || 'Unknown'),
            datasets: [{
                data: this.stats.paymentStatusBreakdown.map(p => p.count),
                backgroundColor: ['#ef4444', '#10b981', '#f59e0b', '#6366f1'],
                hoverBackgroundColor: ['#dc2626', '#059669', '#d97706', '#4f46e5'],
                borderWidth: 0
            }]
        };
        this.paymentChartOptions = {
            cutout: '65%',
            plugins: {
                legend: { position: 'bottom', labels: { color: textColor, usePointStyle: true, padding: 16 } }
            },
            maintainAspectRatio: false
        };
    }

    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'success';
            case 'pending': return 'warn';
            case 'draft': return 'info';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    }

    getPaymentSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (status?.toLowerCase()) {
            case 'paid': return 'success';
            case 'partial': return 'warn';
            case 'unpaid': return 'danger';
            default: return 'secondary';
        }
    }

    formatCurrency(amount: number): string {
        return amount?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0';
    }

    formatDate(dateStr: string): string {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
}
