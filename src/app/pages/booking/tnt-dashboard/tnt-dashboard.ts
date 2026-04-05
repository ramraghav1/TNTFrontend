import { Component, OnInit, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';

import { BookingService, DashboardStats } from '../booking.service';
import { LayoutService } from '../../../layout/service/layout.service';

@Component({
    selector: 'app-tnt-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ChartModule,
        TableModule,
        ButtonModule,
        TagModule,
        ToastModule,
        SkeletonModule,
        TooltipModule,
        TranslateModule
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
        private cdr: ChangeDetectorRef,
        private layoutService: LayoutService
    ) {
        // React to theme/primary/dark mode changes
        effect(() => {
            this.layoutService.layoutConfig();
            if (this.stats) {
                setTimeout(() => {
                    this.buildCharts();
                    this.cdr.detectChanges();
                });
            }
        });
    }

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

        // Read the primary color from theme CSS variables
        const primaryColor = docStyle.getPropertyValue('--p-primary-color')?.trim() || '#6366f1';

        // Helper to create alpha variants from a CSS color
        const withAlpha = (color: string, alpha: number) => {
            // Handle rgb(...) format
            const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (rgbMatch) {
                return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
            }
            // Handle hex format
            const hex = color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        // Derive color family from primary
        const primary100 = withAlpha(primaryColor, 1);
        const primary80 = withAlpha(primaryColor, 0.8);
        const primary60 = withAlpha(primaryColor, 0.6);
        const primary40 = withAlpha(primaryColor, 0.4);
        const primary20 = withAlpha(primaryColor, 0.2);
        const primary10 = withAlpha(primaryColor, 0.1);

        // Booking trend (bar chart) — uses primary color
        this.bookingChartData = {
            labels: this.stats.monthlyBookings.map(m => m.month),
            datasets: [{
                label: 'Bookings',
                data: this.stats.monthlyBookings.map(m => m.count),
                backgroundColor: primary60,
                borderColor: primary100,
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

        // Revenue trend (line chart) — uses primary color
        this.revenueChartData = {
            labels: this.stats.monthlyRevenue.map(m => m.month),
            datasets: [{
                label: 'Revenue (NPR)',
                data: this.stats.monthlyRevenue.map(m => m.amount),
                fill: true,
                backgroundColor: primary10,
                borderColor: primary100,
                tension: 0.4,
                pointBackgroundColor: primary100,
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

        // Status breakdown (doughnut) — primary color family with fades
        this.statusChartData = {
            labels: ['Confirmed', 'Pending', 'Draft', 'Cancelled'],
            datasets: [{
                data: [this.stats.confirmed, this.stats.pending, this.stats.draft, this.stats.cancelled],
                backgroundColor: [primary100, primary60, primary40, primary20],
                hoverBackgroundColor: [primary100, primary80, primary60, primary40],
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

        // Payment status (doughnut) — primary color family with fades
        this.paymentChartData = {
            labels: this.stats.paymentStatusBreakdown.map(p => p.label || 'Unknown'),
            datasets: [{
                data: this.stats.paymentStatusBreakdown.map(p => p.count),
                backgroundColor: [primary100, primary80, primary40, primary20],
                hoverBackgroundColor: [primary100, primary100, primary60, primary40],
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
