import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

export interface DayCostEntry {
    name: string;
    category: string;
    price: number;
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
    costs: DayCostEntry[];
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
// Pricing Interfaces
// ===========================

export interface CostItem {
    id: number;
    name: string;
    category: string;
    unitType: string;
    isActive: boolean;
    createdAt: string;
}

export interface CostItemRate {
    id: number;
    costItemId: number;
    costItemName: string;
    location: string | null;
    itineraryId: number | null;
    price: number;
    currency: string;
    effectiveFrom: string | null;
    effectiveTo: string | null;
}

export interface DayCost {
    id: number;
    itineraryDayId: number;
    costItemId: number;
    costItemName: string;
    category: string;
    unitType: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface BookingCostItem {
    name: string;
    category: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
}

export interface BookingDayCost {
    dayNumber: number;
    location: string | null;
    costItems: BookingCostItem[];
}

export interface BookingPricing {
    totalAmount: number;
    amountPaid: number;
    balanceAmount: number;
    dayCosts: BookingDayCost[];
}

export interface BookingListItem {
    instanceId: number;
    bookingReference: string;
    templateTitle: string;
    status: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    paymentStatus: string;
    createdAt: string;
}

export interface DashboardStats {
    totalBookings: number;
    confirmed: number;
    pending: number;
    draft: number;
    cancelled: number;
    totalRevenue: number;
    collectedRevenue: number;
    totalTravelers: number;
    totalItineraries: number;
    monthlyBookings: { month: string; count: number }[];
    monthlyRevenue: { month: string; amount: number }[];
    topItineraries: { title: string; bookingCount: number }[];
    recentBookings: { instanceId: number; bookingReference: string; templateTitle: string; status: string; paymentStatus: string; totalAmount: number; createdAt: string }[];
    paymentStatusBreakdown: { label: string; count: number }[];
}

// ===========================
// Service
// ===========================

@Injectable({ providedIn: 'root' })
export class BookingService {
    private baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) {}

    // Itinerary
    getItineraries(): Observable<Itinerary[]> {
        return this.http.get<Itinerary[]>(`${this.baseUrl}/Itineraries/list`);
    }

    getItineraryDetail(id: number): Observable<ItineraryDetail> {
        return this.http.get<ItineraryDetail>(`${this.baseUrl}/Itineraries/detail?id=${id}`);
    }

    // Booking
    createBooking(request: CreateBookingRequest): Observable<any> {
        return this.http.post(`${this.baseUrl}/Bookings/create`, request);
    }

    getBookings(): Observable<BookingListItem[]> {
        return this.http.get<BookingListItem[]>(`${this.baseUrl}/Bookings`);
    }

    addPayment(bookingId: number, request: { amount: number; currency: string; paymentMethod: string; transactionReference: string }): Observable<any> {
        return this.http.post(`${this.baseUrl}/Bookings/${bookingId}/payment`, request);
    }

    updateStatus(bookingId: number, status: string): Observable<any> {
        return this.http.put(`${this.baseUrl}/Bookings/${bookingId}/status`, { status });
    }

    customizeBooking(bookingId: number, request: CustomizeBookingRequest): Observable<any> {
        return this.http.put(`${this.baseUrl}/Bookings/${bookingId}/customize`, request);
    }

    // Cost Items
    getCostItems(): Observable<CostItem[]> {
        return this.http.get<CostItem[]>(`${this.baseUrl}/Pricing/cost-items`);
    }

    createCostItem(request: { name: string; category: string; unitType: string }): Observable<CostItem> {
        return this.http.post<CostItem>(`${this.baseUrl}/Pricing/cost-items`, request);
    }

    // Cost Item Rates
    createRate(request: any): Observable<CostItemRate> {
        return this.http.post<CostItemRate>(`${this.baseUrl}/Pricing/rates`, request);
    }

    getRatesByItinerary(itineraryId: number): Observable<CostItemRate[]> {
        return this.http.get<CostItemRate[]>(`${this.baseUrl}/Pricing/rates/itinerary/${itineraryId}`);
    }

    // Day Costs
    assignDayCost(request: { itineraryDayId: number; costItemId: number; quantity: number }): Observable<DayCost> {
        return this.http.post<DayCost>(`${this.baseUrl}/Pricing/day-costs`, request);
    }

    getDayCostsByItinerary(itineraryId: number): Observable<DayCost[]> {
        return this.http.get<DayCost[]>(`${this.baseUrl}/Pricing/day-costs/itinerary/${itineraryId}`);
    }

    removeDayCost(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/Pricing/day-costs/${id}`);
    }

    // Booking Pricing
    getBookingPricing(instanceId: number): Observable<BookingPricing> {
        return this.http.get<BookingPricing>(`${this.baseUrl}/Pricing/booking/${instanceId}`);
    }

    getDashboardStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.baseUrl}/Bookings/dashboard-stats`);
    }
}
