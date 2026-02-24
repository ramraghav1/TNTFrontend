import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { StepperModule } from 'primeng/stepper';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

import {
    BookingService,
    ItineraryDetail,
    ItineraryDay,
    CreateBookingRequest,
    TravelerRequest,
    CustomizeDayRequest
} from '../booking.service';

interface EditableDay extends ItineraryDay {
    newActivity: string;
}

@Component({
    selector: 'app-booking-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        AccordionModule,
        TagModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        CheckboxModule,
        DatePickerModule,
        InputNumberModule,
        ChipModule,
        ToastModule,
        DividerModule,
        StepperModule,
        ProgressSpinnerModule
    ],
    providers: [MessageService],
    templateUrl: './booking-detail.html',
    styleUrls: ['./booking-detail.scss']
})
export class BookingDetail implements OnInit {
    itinerary?: ItineraryDetail;
    loading = true;
    submitting = false;

    // Editable days
    editableDays: EditableDay[] = [];

    // Booking form fields
    startDate: Date | null = null;
    endDate: Date | null = null;
    specialRequests = '';

    // Travelers
    travelers: TravelerRequest[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bookingService: BookingService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.loading = false;
            return;
        }

        this.bookingService.getItineraryDetail(+id).subscribe({
            next: (res) => {
                this.itinerary = res;
                this.editableDays = res.days.map((d) => ({
                    ...d,
                    activities: [...d.activities],
                    newActivity: ''
                }));
                // Set default dates
                this.startDate = new Date();
                const end = new Date();
                end.setDate(end.getDate() + res.durationDays);
                this.endDate = end;
                // Add one default traveler
                this.addTraveler();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load itinerary details' });
                this.cdr.detectChanges();
            }
        });
    }

    // ---- Traveler management ----

    addTraveler() {
        this.travelers.push({
            fullName: '',
            contactNumber: '',
            email: '',
            nationality: '',
            adults: 1,
            children: 0,
            seniors: 0
        });
    }

    removeTraveler(index: number) {
        this.travelers.splice(index, 1);
    }

    // ---- Activity management ----

    addActivity(day: EditableDay) {
        if (day.newActivity?.trim()) {
            day.activities.push(day.newActivity.trim());
            day.newActivity = '';
        }
    }

    removeActivity(day: EditableDay, index: number) {
        day.activities.splice(index, 1);
    }

    // ---- Difficulty tag ----

    getDifficultySeverity(level: string): 'success' | 'secondary' | 'danger' | 'info' {
        switch (level?.toLowerCase()) {
            case 'easy': return 'success';
            case 'moderate': return 'secondary';
            case 'hard': return 'danger';
            default: return 'info';
        }
    }

    // ---- Form validation ----

    isFormValid(): boolean {
        if (!this.startDate || !this.endDate) return false;
        if (this.travelers.length === 0) return false;
        return this.travelers.every((t) => t.fullName.trim().length > 0);
    }

    // ---- Submit booking ----

    continueBooking() {
        if (!this.itinerary) return;

        if (!this.isFormValid()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Please fill in all required fields (start date, end date, and at least one traveler with a name).'
            });
            return;
        }

        this.submitting = true;

        const request: CreateBookingRequest = {
            itineraryId: this.itinerary.id,
            startDate: this.startDate!.toISOString(),
            endDate: this.endDate!.toISOString(),
            travelers: this.travelers,
            specialRequests: this.specialRequests
        };

        this.bookingService.createBooking(request).subscribe({
            next: (res) => {
                this.submitting = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Booking Created',
                    detail: 'Your booking has been created successfully!'
                });
                this.cdr.detectChanges();
                // Navigate back to booking list after a short delay
                setTimeout(() => this.router.navigate(['/booking-list']), 1500);
            },
            error: (err) => {
                console.error(err);
                this.submitting = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to create booking. Please try again.'
                });
                this.cdr.detectChanges();
            }
        });
    }

    goBack() {
        this.router.navigate(['/booking-list']);
    }
}
