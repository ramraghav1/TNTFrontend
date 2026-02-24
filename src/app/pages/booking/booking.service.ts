import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ===========================
// Interfaces
// ===========================

export interface Itinerary {
    id: number;
    title: string;
    description: string;
    durationDays: number;
    difficultyLevel: string;
}

export interface ItineraryDay {
    id: number;
    dayNumber: number;
    title: string;
    location: string;
    accommodation: string;
    transport: string;
    breakfastIncluded: boolean;
    lunchIncluded: boolean;
    dinnerIncluded: boolean;
    activities: string[];
}

export interface ItineraryDetail {
    id: number;
    title: string;
    description: string;
    durationDays: number;
    difficultyLevel: string;
    days: ItineraryDay[];
}

export interface TravelerRequest {
    fullName: string;
    contactNumber: string;
    email: string;
    nationality: string;
    adults: number;
    children: number;
    seniors: number;
}

export interface CreateBookingRequest {
    itineraryId: number;
    startDate: string;
    endDate: string;
    travelers: TravelerRequest[];
    specialRequests: string;
}

export interface CustomizeDayRequest {
    instanceDayId: number;
    title: string;
    location: string;
    accommodation: string;
    transport: string;
    breakfastIncluded: boolean;
    lunchIncluded: boolean;
    dinnerIncluded: boolean;
    activities: string[];
}

export interface CustomizeBookingRequest {
    days: CustomizeDayRequest[];
}

// ===========================
// Service
// ===========================

@Injectable({ providedIn: 'root' })
export class BookingService {
    private baseUrl = 'https://localhost:7236/api';

    constructor(private http: HttpClient) {}

    getItineraries(): Observable<Itinerary[]> {
        return this.http.get<Itinerary[]>(`${this.baseUrl}/Itineraries/list`);
    }

    getItineraryDetail(id: number): Observable<ItineraryDetail> {
        return this.http.get<ItineraryDetail>(`${this.baseUrl}/Itineraries/detail?id=${id}`);
    }

    createBooking(request: CreateBookingRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}/Booking/create`, request);
    }

    customizeBooking(bookingId: number, request: CustomizeBookingRequest): Observable<any> {
        return this.http.put(`${this.baseUrl}/Booking/${bookingId}/customize`, request);
    }
}
