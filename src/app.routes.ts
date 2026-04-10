import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Userlist } from './app/pages/user/userlist/userlist';
import { AddItinerary } from './app/pages/itinerary/add-itinerary/add-itinerary';
import { SendTransaction } from './app/pages/remittance/send-transaction/send-transaction';
import { Login } from './app/pages/auth/login';
import { ItineraryList } from './app/pages/itinerary/itinerary-list/itinerary-list';
import { ItineraryDetailsComponent } from './app/pages/itinerary/itinerary-details/itinerary-details';
import { EditItinerary } from './app/pages/itinerary/edit-itinerary/edit-itinerary';
import { BookingList } from './app/pages/booking/booking-list/booking-list';
import { BookingDetail } from './app/pages/booking/booking-detail/booking-detail';
import { MyBookings } from './app/pages/booking/my-bookings/my-bookings';
import { TntDashboard } from './app/pages/booking/tnt-dashboard/tnt-dashboard';
import { ManageBookings } from './app/pages/booking/manage-bookings/manage-bookings';
import { DepartureList } from './app/pages/booking/departure-list/departure-list';
import { CountryList } from './app/pages/remittance/country-list/country-list';
import { PaymentTypeList } from './app/pages/remittance/payment-type-list/payment-type-list';
import { AgentList } from './app/pages/remittance/agent-list/agent-list';
import { ServiceChargeList } from './app/pages/remittance/service-charge-list/service-charge-list';
import { ServiceChargeForm } from './app/pages/remittance/service-charge-form/service-charge-form';
import { FxRateList } from './app/pages/remittance/fx-rate-list/fx-rate-list';
import { FxRateForm } from './app/pages/remittance/fx-rate-form/fx-rate-form';
import { BranchList } from './app/pages/remittance/branch-list/branch-list';
import { BranchUserList } from './app/pages/remittance/branch-user-list/branch-user-list';
import { AgentAccountList } from './app/pages/remittance/agent-account-list/agent-account-list';
import { AgentStatement } from './app/pages/remittance/agent-statement/agent-statement';
import { ConfigurationTypeList } from './app/pages/remittance/configuration-type-list/configuration-type-list';
import { ConfigurationList } from './app/pages/remittance/configuration-list/configuration-list';
import { DomesticServiceChargeList } from './app/pages/remittance/domestic-service-charge-list/domestic-service-charge-list';
import { DomesticServiceChargeForm } from './app/pages/remittance/domestic-service-charge-form/domestic-service-charge-form';
import { VoucherList } from './app/pages/remittance/voucher-list/voucher-list';
import { StatementOfAccount } from './app/pages/remittance/statement-of-account/statement-of-account';
import { ClinicDashboard } from './app/pages/clinic/clinic-dashboard/clinic-dashboard';
import { TenantList } from './app/pages/clinic/tenant-list/tenant-list';
import { PractitionerList } from './app/pages/clinic/practitioner-list/practitioner-list';
import { PatientList } from './app/pages/clinic/patient-list/patient-list';
import { ClinicServiceList } from './app/pages/clinic/clinic-service-list/clinic-service-list';
import { AppointmentList } from './app/pages/clinic/appointment-list/appointment-list';
import { InvoiceList } from './app/pages/clinic/invoice-list/invoice-list';
import { OrganizationSetup } from './app/pages/organization/organization-setup/organization-setup';
import { HotelListComponent } from './app/pages/inventory/hotel-list/hotel-list';
import { HotelFormComponent } from './app/pages/inventory/hotel-form/hotel-form';
import { VehicleListComponent } from './app/pages/inventory/vehicle-list/vehicle-list';
import { VehicleFormComponent } from './app/pages/inventory/vehicle-form/vehicle-form';
import { GuideListComponent } from './app/pages/inventory/guide-list/guide-list';
import { GuideFormComponent } from './app/pages/inventory/guide-form/guide-form';
import { ActivityListComponent } from './app/pages/inventory/activity-list/activity-list';
import { ActivityFormComponent } from './app/pages/inventory/activity-form/activity-form';
import { AvailabilityCalendarComponent } from './app/pages/inventory/availability-calendar/availability-calendar';
import { authGuard } from './app/auth.guard';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: 'my-project-dashboard', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'userlist', component: Userlist },
            { path: 'add-itinerary', component: AddItinerary },
            { path: 'itinerary-list', component: ItineraryList },
            { path: 'send-transaction', component: SendTransaction },
            { path: 'transaction-report', loadComponent: () => import('./app/pages/remittance/transaction-report/transaction-report').then(m => m.TransactionReport) },
            { path: 'itinerary-details/:id', component: ItineraryDetailsComponent },
            { path: 'edit-itinerary/:id', component: EditItinerary },
            { path: 'booking-list', component: BookingList },
            { path: 'booking-detail/:id', component: BookingDetail },
            { path: 'my-bookings', component: MyBookings },
            { path: 'manage-bookings', component: ManageBookings },
            { path: 'departure-list', component: DepartureList },
            { path: 'tnt-dashboard', component: TntDashboard },
            { path: 'remittance/countries', component: CountryList },
            { path: 'remittance/payment-types', component: PaymentTypeList },
            { path: 'remittance/agents', component: AgentList },
            { path: 'remittance/service-charges', component: ServiceChargeList },
            { path: 'remittance/service-charge-form', component: ServiceChargeForm },
            { path: 'remittance/service-charge-form/:id', component: ServiceChargeForm },
            { path: 'remittance/fx-rates', component: FxRateList },
            { path: 'remittance/fx-rate-form', component: FxRateForm },
            { path: 'remittance/fx-rate-form/:id', component: FxRateForm },
            { path: 'remittance/branches/:agentId', component: BranchList },
            { path: 'remittance/branch-users/:branchId', component: BranchUserList },
            { path: 'remittance/agent-accounts', component: AgentAccountList },
            { path: 'remittance/agent-statement/:accountId', component: AgentStatement },
            { path: 'remittance/configuration-types', component: ConfigurationTypeList },
            { path: 'remittance/configurations', component: ConfigurationList },
            { path: 'remittance/domestic-service-charges', component: DomesticServiceChargeList },
            { path: 'remittance/domestic-service-charge-form', component: DomesticServiceChargeForm },
            { path: 'remittance/domestic-service-charge-form/:id', component: DomesticServiceChargeForm },
            { path: 'remittance/vouchers', component: VoucherList },
            { path: 'remittance/statement-of-account', component: StatementOfAccount },
            // Clinic
            { path: 'clinic/dashboard', component: ClinicDashboard },
            { path: 'clinic/tenants', component: TenantList },
            { path: 'clinic/practitioners', component: PractitionerList },
            { path: 'clinic/patients', component: PatientList },
            { path: 'clinic/services', component: ClinicServiceList },
            { path: 'clinic/appointments', component: AppointmentList },
            { path: 'clinic/invoices', component: InvoiceList },
            { path: 'organization-setup', component: OrganizationSetup },
            // Inventory Management
            { path: 'inventory/hotels', component: HotelListComponent },
            { path: 'inventory/hotels/new', component: HotelFormComponent },
            { path: 'inventory/hotels/edit/:id', component: HotelFormComponent },
            { path: 'inventory/vehicles', component: VehicleListComponent },
            { path: 'inventory/vehicles/new', component: VehicleFormComponent },
            { path: 'inventory/vehicles/edit/:id', component: VehicleFormComponent },
            { path: 'inventory/guides', component: GuideListComponent },
            { path: 'inventory/guides/new', component: GuideFormComponent },
            { path: 'inventory/guides/edit/:id', component: GuideFormComponent },
            { path: 'inventory/activities', component: ActivityListComponent },
            { path: 'inventory/activities/new', component: ActivityFormComponent },
            { path: 'inventory/activities/edit/:id', component: ActivityFormComponent },
            // Availability Management
            { path: 'availability/calendar', component: AvailabilityCalendarComponent }
        ]
    },
    { path: 'landing', component: Landing },
    {
        path: 'tour',
        loadChildren: () => import('./app/pages/tour-website/tour.routes').then(m => m.tourRoutes)
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
