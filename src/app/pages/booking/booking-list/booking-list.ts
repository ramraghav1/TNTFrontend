import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

import { BookingService, Itinerary } from '../booking.service';

@Component({
    selector: 'app-booking-list',
    standalone: true,
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        TableModule,
        ButtonModule,
        ToastModule,
        InputTextModule,
        TagModule,
        TooltipModule
    ],
    providers: [MessageService],
    templateUrl: './booking-list.html',
    styleUrls: ['./booking-list.scss']
})
export class BookingList implements OnInit {
    itineraries: Itinerary[] = [];
    loading = false;

    constructor(
        private bookingService: BookingService,
        private router: Router,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadItineraries();
    }

    loadItineraries() {
        this.loading = true;
        this.bookingService.getItineraries().subscribe({
            next: (data) => {
                this.itineraries = data;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load itineraries' });
                this.cdr.detectChanges();
            }
        });
    }

    viewDetail(itinerary: Itinerary) {
        this.router.navigate(['/booking-detail', itinerary.id]);
    }

    getDifficultySeverity(level: string): 'success' | 'secondary' | 'danger' | 'info' {
        switch (level?.toLowerCase()) {
            case 'easy': return 'success';
            case 'moderate': return 'secondary';
            case 'hard': return 'danger';
            default: return 'info';
        }
    }
}
