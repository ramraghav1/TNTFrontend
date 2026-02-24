import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Userlist } from './app/pages/user/userlist/userlist';
import { AddItinerary } from './app/pages/itinerary/add-itinerary/add-itinerary';
import { SendTransaction } from './app/pages/transaction/send-transaction/send-transaction';
import { Login } from './app/pages/auth/login';
import { ItineraryList } from './app/pages/itinerary/itinerary-list/itinerary-list';
import { ItineraryDetailsComponent } from './app/pages/itinerary/itinerary-details/itinerary-details';
import { BookingList } from './app/pages/booking/booking-list/booking-list';
import { BookingDetail } from './app/pages/booking/booking-detail/booking-detail';
import { CountryList } from './app/pages/remittance/country-list/country-list';
import { PaymentTypeList } from './app/pages/remittance/payment-type-list/payment-type-list';
import { AgentList } from './app/pages/remittance/agent-list/agent-list';
import { ServiceChargeList } from './app/pages/remittance/service-charge-list/service-charge-list';
import { ServiceChargeForm } from './app/pages/remittance/service-charge-form/service-charge-form';
import { FxRateList } from './app/pages/remittance/fx-rate-list/fx-rate-list';
import { FxRateForm } from './app/pages/remittance/fx-rate-form/fx-rate-form';
import { BranchList } from './app/pages/remittance/branch-list/branch-list';
import { BranchUserList } from './app/pages/remittance/branch-user-list/branch-user-list';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'my-project-dashboard', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'userlist', component: Userlist },
            { path: 'add-itinerary', component: AddItinerary },
            { path: 'itinerary-list', component: ItineraryList },
            { path: 'send-transaction', component: SendTransaction },
            { path: 'transaction-report', loadComponent: () => import('./app/pages/transaction/transaction-report/transaction-report').then(m => m.TransactionReport) },
            { path: 'itinerary-details/:id', component: ItineraryDetailsComponent },
            { path: 'booking-list', component: BookingList },
            { path: 'booking-detail/:id', component: BookingDetail },
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
            { path: 'remittance/branch-users/:branchId', component: BranchUserList }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
