import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ===========================
// Country
// ===========================
export interface Country {
    id: number;
    name: string;
    iso2Code: string;
    iso3Code: string;
    phoneCode: string;
    currencyCode: string;
    currencyName: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateCountryRequest {
    name: string;
    iso2Code: string;
    iso3Code: string;
    phoneCode: string;
    currencyCode: string;
    currencyName: string;
    isActive: boolean;
}

export interface UpdateCountryRequest {
    name?: string;
    iso2Code?: string;
    iso3Code?: string;
    phoneCode?: string;
    currencyCode?: string;
    currencyName?: string;
    isActive?: boolean;
}

// ===========================
// Payment Type
// ===========================
export interface PaymentType {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreatePaymentTypeRequest {
    name: string;
    description: string;
    isActive: boolean;
}

export interface UpdatePaymentTypeRequest {
    name?: string;
    description?: string;
    isActive?: boolean;
}

// ===========================
// Agent
// ===========================
export interface Agent {
    id: number;
    name: string;
    countryId: number;
    countryName: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateAgentRequest {
    name: string;
    countryId: number;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    isActive: boolean;
}

export interface UpdateAgentRequest {
    name?: string;
    countryId?: number;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
    isActive?: boolean;
}

// ===========================
// Service Charge Setup
// ===========================
export interface ServiceChargeSlab {
    id?: number;
    minAmount: number;
    maxAmount: number;
    chargeType: string; // Flat | Percentage
    chargeValue: number;
    currency: string;
}

export interface ServiceChargeSetup {
    id: number;
    sendingCountryId: number;
    sendingCountryName: string;
    receivingCountryId: number;
    receivingCountryName: string;
    paymentTypeId: number;
    paymentTypeName: string;
    agentId: number | null;
    agentName: string | null;
    chargeMode: string; // Flat | Range
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    slabs: ServiceChargeSlab[];
}

export interface CreateServiceChargeSetupRequest {
    sendingCountryId: number;
    receivingCountryId: number;
    paymentTypeId: number;
    agentId: number | null;
    chargeMode: string;
    isActive: boolean;
    createdBy: string;
    slabs: ServiceChargeSlab[];
}

export interface UpdateServiceChargeSetupRequest {
    sendingCountryId?: number;
    receivingCountryId?: number;
    paymentTypeId?: number;
    agentId?: number | null;
    chargeMode?: string;
    isActive?: boolean;
    slabs?: ServiceChargeSlab[];
}

export interface CalculateChargeRequest {
    sendingCountryId: number;
    receivingCountryId: number;
    paymentTypeId: number;
    agentId: number | null;
    amount: number;
}

export interface CalculateChargeResponse {
    chargeType: string;
    chargeValue: number;
    calculatedCharge: number;
    currency: string;
}

// ===========================
// Service
// ===========================
@Injectable({ providedIn: 'root' })
export class RemittanceService {
    private baseUrl = 'https://localhost:7236/api/remittance';

    constructor(private http: HttpClient) {}

    // --- Country ---
    getCountries(): Observable<Country[]> {
        return this.http.get<Country[]>(`${this.baseUrl}/countries`);
    }
    getCountry(id: number): Observable<Country> {
        return this.http.get<Country>(`${this.baseUrl}/countries/${id}`);
    }
    createCountry(req: CreateCountryRequest): Observable<Country> {
        return this.http.post<Country>(`${this.baseUrl}/countries`, req);
    }
    updateCountry(id: number, req: UpdateCountryRequest): Observable<Country> {
        return this.http.put<Country>(`${this.baseUrl}/countries/${id}`, req);
    }
    deleteCountry(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/countries/${id}`);
    }

    // --- Payment Type ---
    getPaymentTypes(): Observable<PaymentType[]> {
        return this.http.get<PaymentType[]>(`${this.baseUrl}/payment-types`);
    }
    getPaymentType(id: number): Observable<PaymentType> {
        return this.http.get<PaymentType>(`${this.baseUrl}/payment-types/${id}`);
    }
    createPaymentType(req: CreatePaymentTypeRequest): Observable<PaymentType> {
        return this.http.post<PaymentType>(`${this.baseUrl}/payment-types`, req);
    }
    updatePaymentType(id: number, req: UpdatePaymentTypeRequest): Observable<PaymentType> {
        return this.http.put<PaymentType>(`${this.baseUrl}/payment-types/${id}`, req);
    }
    deletePaymentType(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/payment-types/${id}`);
    }

    // --- Agent ---
    getAgents(): Observable<Agent[]> {
        return this.http.get<Agent[]>(`${this.baseUrl}/agents`);
    }
    getAgentsByCountry(countryId: number): Observable<Agent[]> {
        return this.http.get<Agent[]>(`${this.baseUrl}/agents/by-country/${countryId}`);
    }
    getAgent(id: number): Observable<Agent> {
        return this.http.get<Agent>(`${this.baseUrl}/agents/${id}`);
    }
    createAgent(req: CreateAgentRequest): Observable<Agent> {
        return this.http.post<Agent>(`${this.baseUrl}/agents`, req);
    }
    updateAgent(id: number, req: UpdateAgentRequest): Observable<Agent> {
        return this.http.put<Agent>(`${this.baseUrl}/agents/${id}`, req);
    }
    deleteAgent(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/agents/${id}`);
    }

    // --- Service Charge Setup ---
    getServiceCharges(): Observable<ServiceChargeSetup[]> {
        return this.http.get<ServiceChargeSetup[]>(`${this.baseUrl}/service-charges`);
    }
    getServiceCharge(id: number): Observable<ServiceChargeSetup> {
        return this.http.get<ServiceChargeSetup>(`${this.baseUrl}/service-charges/${id}`);
    }
    createServiceCharge(req: CreateServiceChargeSetupRequest): Observable<ServiceChargeSetup> {
        return this.http.post<ServiceChargeSetup>(`${this.baseUrl}/service-charges`, req);
    }
    updateServiceCharge(id: number, req: UpdateServiceChargeSetupRequest): Observable<ServiceChargeSetup> {
        return this.http.put<ServiceChargeSetup>(`${this.baseUrl}/service-charges/${id}`, req);
    }
    deleteServiceCharge(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/service-charges/${id}`);
    }
    calculateCharge(req: CalculateChargeRequest): Observable<CalculateChargeResponse> {
        return this.http.post<CalculateChargeResponse>(`${this.baseUrl}/service-charges/calculate`, req);
    }
}
