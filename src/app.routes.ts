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

export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'userlist', component: Userlist },
            { path: 'add-itinerary', component: AddItinerary },
            { path: 'send-transaction', component: SendTransaction },
            { path: 'transaction-report', loadComponent: () => import('./app/pages/transaction/transaction-report/transaction-report').then(m => m.TransactionReport) }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
