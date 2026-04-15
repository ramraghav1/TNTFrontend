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
import { DepartureManagementService, DepartureListItem } from '../departure-management.service';
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

    departures: DepartureListItem[] = [];
    departuresLoading = true;
    departureStatusChartData: any;
    departureStatusChartOptions: any;

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
        private departureService: DepartureManagementService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef,
        private layoutService: LayoutService
    ) {
        // React to theme/primary/dark mode changes
        effect(() => {
            this.layoutService.layoutConfig();
            setTimeout(() => {
                if (this.stats) this.buildCharts();
                if (this.departures.length) this.buildDepartureStatusChart();
                this.cdr.detectChanges();
            }, 50);
        });
    }

    ngOnInit(): void {
        this.loadStats();
        this.loadDepartures();
    }

    loadDepartures() {
        this.departuresLoading = true;
        this.departureService.getAllDepartures().subscribe({
            next: (data) => {
                this.departures = data || [];
                this.buildDepartureStatusChart();
                this.departuresLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.departuresLoading = false;
                this.cdr.detectChanges();
            }
        });
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

    private buildDepartureStatusChart() {
        const docStyle = getComputedStyle(document.documentElement);
        const textColor = docStyle.getPropertyValue('--p-text-color') || '#495057';

        // Primary shades (theme-aware CSS vars)
        const p600 = docStyle.getPropertyValue('--p-primary-600')?.trim() || '#4f46e5';
        const p500 = docStyle.getPropertyValue('--p-primary-500')?.trim() || '#6366f1';
        const p300 = docStyle.getPropertyValue('--p-primary-300')?.trim() || '#a5b4fc';
        const p200 = docStyle.getPropertyValue('--p-primary-200')?.trim() || '#c7d2fe';
        const p400 = docStyle.getPropertyValue('--p-primary-400')?.trim() || '#818cf8';
        const p100 = docStyle.getPropertyValue('--p-primary-100')?.trim() || '#e0e7ff';

        // Secondary accent shades (amber — complements most primary palettes)
        const sec500 = docStyle.getPropertyValue('--p-amber-500')?.trim() || '#f59e0b';
        const sec400 = docStyle.getPropertyValue('--p-amber-400')?.trim() || '#fbbf24';

        const counts = { Upcoming: 0, Ongoing: 0, Completed: 0, Cancelled: 0 };
        for (const d of this.departures) {
            const s = d.computedStatus as keyof typeof counts;
            if (s in counts) counts[s]++;
        }

        // 2-color family: primary shades + secondary (amber) shades
        // Base / Hover pairs are chosen so no hover shade matches any other segment's base shade.
        //   Upcoming  → p500  (hover p600)
        //   Ongoing   → p300  (hover p400)  ← p400 never appears as a base
        //   Completed → sec400 (hover sec500) ← secondary family, no clash
        //   Cancelled → p100  (hover p200)  ← p200 never appears as a base
        this.departureStatusChartData = {
            labels: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
            datasets: [{
                data: [counts.Upcoming, counts.Ongoing, counts.Completed, counts.Cancelled],
                backgroundColor:      [p500,  p300,  sec400, p100],
                hoverBackgroundColor: [p600,  p400,  sec500, p200],
                borderWidth: 2,
                borderColor: 'transparent',
                hoverBorderColor: '#fff',
                hoverBorderWidth: 2
            }]
        };
        this.departureStatusChartOptions = {
            cutout: '65%',
            plugins: {
                legend: { position: 'bottom', labels: { color: textColor, usePointStyle: true, padding: 16 } }
            },
            maintainAspectRatio: false
        };
    }

    getDepartureStatusSeverity(status: string): 'info' | 'success' | 'secondary' | 'danger' {
        switch (status?.toLowerCase()) {
            case 'upcoming':  return 'info';
            case 'ongoing':   return 'success';
            case 'completed': return 'secondary';
            case 'cancelled': return 'danger';
            default:          return 'info';
        }
    }

    getDepartureFill(dep: DepartureListItem): number {
        return dep.capacity > 0 ? Math.round((dep.bookedCount / dep.capacity) * 100) : 0;
    }

    formatDepartureDate(dateStr: string): string {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    private buildCharts() {
        if (!this.stats) return;

        const docStyle = getComputedStyle(document.documentElement);
        const textColor = docStyle.getPropertyValue('--p-text-color') || '#495057';
        const surfaceBorder = docStyle.getPropertyValue('--p-content-border-color') || '#dee2e6';
        const primaryColor = docStyle.getPropertyValue('--p-primary-color')?.trim() || '#6366f1';

        // Alpha helper (used only for bar / line fills)
        const withAlpha = (color: string, alpha: number): string => {
            const rgbMatch = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (rgbMatch) return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${alpha})`;
            const hex = color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        // ── Primary shade family (theme-aware CSS vars) ──
        // Each label resolves to a distinctly different shade so hover steps never
        // land on another segment's base colour.
        const p700 = docStyle.getPropertyValue('--p-primary-700')?.trim() || withAlpha(primaryColor, 1.0);
        const p600 = docStyle.getPropertyValue('--p-primary-600')?.trim() || withAlpha(primaryColor, 0.88);
        const p500 = docStyle.getPropertyValue('--p-primary-500')?.trim() || primaryColor;
        const p400 = docStyle.getPropertyValue('--p-primary-400')?.trim() || withAlpha(primaryColor, 0.72);
        const p300 = docStyle.getPropertyValue('--p-primary-300')?.trim() || withAlpha(primaryColor, 0.55);
        const p200 = docStyle.getPropertyValue('--p-primary-200')?.trim() || withAlpha(primaryColor, 0.38);
        const p100 = docStyle.getPropertyValue('--p-primary-100')?.trim() || withAlpha(primaryColor, 0.22);

        // ── Secondary accent family (amber — pairs well with most PrimeNG primaries) ──
        const sec600 = docStyle.getPropertyValue('--p-amber-600')?.trim() || '#d97706';
        const sec500 = docStyle.getPropertyValue('--p-amber-500')?.trim() || '#f59e0b';
        const sec300 = docStyle.getPropertyValue('--p-amber-300')?.trim() || '#fcd34d';
        const sec200 = docStyle.getPropertyValue('--p-amber-200')?.trim() || '#fde68a';

        // ── Bar chart: Booking trend ──
        this.bookingChartData = {
            labels: this.stats.monthlyBookings.map(m => m.month),
            datasets: [{
                label: 'Bookings',
                data: this.stats.monthlyBookings.map(m => m.count),
                backgroundColor: withAlpha(primaryColor, 0.6),
                borderColor: p500,
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

        // ── Line chart: Revenue trend ──
        this.revenueChartData = {
            labels: this.stats.monthlyRevenue.map(m => m.month),
            datasets: [{
                label: 'Revenue (NPR)',
                data: this.stats.monthlyRevenue.map(m => m.amount),
                fill: true,
                backgroundColor: withAlpha(primaryColor, 0.1),
                borderColor: p500,
                tension: 0.4,
                pointBackgroundColor: p500,
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

        // ── Doughnut: Booking status ──
        // Base colours use well-spaced shades; hover steps UP one shade level,
        // so no hover colour ever matches another segment's base colour.
        //   Confirmed → p500  (hover p600)
        //   Pending   → p300  (hover p400)   ← p400 not used as base → no clash
        //   Draft     → p100  (hover p200)   ← p200 not used as base → no clash
        //   Cancelled → sec500 (hover sec600) ← entirely different family → no clash
        this.statusChartData = {
            labels: ['Confirmed', 'Pending', 'Draft', 'Cancelled'],
            datasets: [{
                data: [this.stats.confirmed, this.stats.pending, this.stats.draft, this.stats.cancelled],
                backgroundColor:      [p500,  p300,  p100,  sec500],
                hoverBackgroundColor: [p600,  p400,  p200,  sec600],
                borderWidth: 2,
                borderColor: 'transparent',
                hoverBorderColor: '#fff',
                hoverBorderWidth: 2
            }]
        };
        this.statusChartOptions = {
            cutout: '65%',
            plugins: {
                legend: { position: 'bottom', labels: { color: textColor, usePointStyle: true, padding: 16 } }
            },
            maintainAspectRatio: false
        };

        // ── Doughnut: Payment status ──
        // Colour mapping by label (order-independent):
        //   Paid    → p500  (hover p600)
        //   Partial → sec200 (hover sec300)   ← sec300 ≠ sec500 (Unpaid base) → no clash
        //   Unpaid  → sec500 (hover sec600)
        //   Others  → p300  (hover p400)
        const payBg: string[]  = [];
        const payHov: string[] = [];
        this.stats.paymentStatusBreakdown.forEach((p, i) => {
            const lbl = (p.label || '').toLowerCase();
            if (lbl === 'paid')    { payBg.push(p500);  payHov.push(p600);  }
            else if (lbl === 'partial') { payBg.push(sec200); payHov.push(sec300); }
            else if (lbl === 'unpaid')  { payBg.push(sec500); payHov.push(sec600); }
            else {
                const fallbackBg  = [p500, p300, p100, sec500];
                const fallbackHov = [p600, p400, p200, sec600];
                payBg.push(fallbackBg[i % fallbackBg.length]);
                payHov.push(fallbackHov[i % fallbackHov.length]);
            }
        });
        this.paymentChartData = {
            labels: this.stats.paymentStatusBreakdown.map(p => p.label || 'Unknown'),
            datasets: [{
                data: this.stats.paymentStatusBreakdown.map(p => p.count),
                backgroundColor: payBg,
                hoverBackgroundColor: payHov,
                borderWidth: 2,
                borderColor: 'transparent',
                hoverBorderColor: '#fff',
                hoverBorderWidth: 2
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
