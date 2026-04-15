import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];

    private allMenus: { [key: string]: MenuItem } = {};

    // Define which menu groups each org type can see
    private orgMenuMap: { [key: string]: string[] } = {
        'tourandtravels': ['TNT Home', 'Itinerary', 'Booking', 'Inventory', 'Availability', 'Finance', 'User Management', 'Tenant'],
                    'tourandtravel': ['TNT Home', 'Itinerary', 'Booking', 'Inventory', 'Availability', 'Finance', 'User Management', 'Tenant'],
        'remittance': ['Home', 'Transaction', 'Reports', 'Remittance', 'User Management', 'Tenant'],
        'clinic': ['Home', 'Clinic', 'User Management', 'Tenant'],
    };

    ngOnInit() {
        this.allMenus = {
            'TNT Home': {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/tnt-dashboard'] },
                ]
            },
            'Home': {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/my-project-dashboard'] },
                    { label: 'Organization Setup', icon: 'pi pi-fw pi-building', routerLink: ['/organization-setup'] }
                ]
            },
            'Transaction': {
                label: 'Transaction',
                items: [
                    { label: 'Send Money', icon: 'pi pi-fw pi-money-bill', routerLink: ['/send-transaction'] },
                    { label: 'Payout Money', icon: 'pi pi-fw pi-credit-card', routerLink: ['/transaction/payout'] },
                    { label: 'Cancel Trannsaction', icon: 'pi pi-fw pi-minus', routerLink: ['/gettingstarted/features'] },
                   
                ]
            },
            'Reports': {
                label: 'Reports',
                items: [
                    { label: 'Transaction Report', icon: 'pi pi-fw pi-book', routerLink: ['/transaction-report'] }
    
                ]
            },
            'Itinerary': {
                label: 'Itinerary',
                items: [
                    { label: 'Manage Itinerary', icon: 'pi pi-fw pi-map', routerLink: ['/itinerary-list'] },
                    { label: 'Add Itinerary', icon: 'pi pi-fw pi-plus-circle', routerLink: ['/add-itinerary'] },
                ]
            },
            'Booking': {
                label: 'Booking',
                items: [
                    { label: 'Book Itinerary', icon: 'pi pi-fw pi-bookmark', routerLink: ['/booking-list'] },
                    { label: 'My Bookings', icon: 'pi pi-fw pi-list', routerLink: ['/my-bookings'] },
                    { label: 'Departures', icon: 'pi pi-fw pi-map', routerLink: ['/departure-list'] },
                ]
            },
            'Inventory': {
                label: 'Inventory',
                items: [
                    { label: 'Hotels', icon: 'pi pi-fw pi-building', routerLink: ['/inventory/hotels'] },
                    { label: 'Vehicles', icon: 'pi pi-fw pi-car', routerLink: ['/inventory/vehicles'] },
                    { label: 'Guides', icon: 'pi pi-fw pi-user', routerLink: ['/inventory/guides'] },
                    { label: 'Activities', icon: 'pi pi-fw pi-flag', routerLink: ['/inventory/activities'] },
                ]
            },
            'Availability': {
                label: 'Availability',
                items: [
                    { label: 'Calendar', icon: 'pi pi-fw pi-calendar', routerLink: ['/availability/calendar'] },
                ]
            },
            'Finance': {
                label: 'Finance',
                items: [
                    { label: 'Finance Summary', icon: 'pi pi-fw pi-chart-pie', routerLink: ['/finance/summary'] },
                    { label: 'Invoices', icon: 'pi pi-fw pi-file', routerLink: ['/finance/invoices'] },
                    { label: 'Expenses', icon: 'pi pi-fw pi-money-bill', routerLink: ['/finance/expenses'] },
                    { label: 'Commissions', icon: 'pi pi-fw pi-percentage', routerLink: ['/finance/commissions'] },
                    { label: 'Refunds', icon: 'pi pi-fw pi-replay', routerLink: ['/finance/refunds'] },
                ]
            },
            'Remittance': {
                label: 'Remittance',
                items: [
                    { label: 'Countries', icon: 'pi pi-fw pi-globe', routerLink: ['/remittance/countries'] },
                    { label: 'Payment Types', icon: 'pi pi-fw pi-credit-card', routerLink: ['/remittance/payment-types'] },
                    { label: 'Agents', icon: 'pi pi-fw pi-users', routerLink: ['/remittance/agents'] },
                    { label: 'Service Charges', icon: 'pi pi-fw pi-money-bill', routerLink: ['/remittance/service-charges'] },
                    { label: 'FX Rates', icon: 'pi pi-fw pi-chart-line', routerLink: ['/remittance/fx-rates'] },
                    { label: 'Agent Accounts', icon: 'pi pi-fw pi-wallet', routerLink: ['/remittance/agent-accounts'] },
                    { label: 'Configuration Types', icon: 'pi pi-fw pi-cog', routerLink: ['/remittance/configuration-types'] },
                    { label: 'Configurations', icon: 'pi pi-fw pi-list', routerLink: ['/remittance/configurations'] },
                    { label: 'Domestic Service Charges', icon: 'pi pi-fw pi-building', routerLink: ['/remittance/domestic-service-charges'] },
                    { label: 'Vouchers', icon: 'pi pi-fw pi-file-edit', routerLink: ['/remittance/vouchers'] },
                    { label: 'Statement of Account', icon: 'pi pi-fw pi-book', routerLink: ['/remittance/statement-of-account'] },
                ]
            },
            'Clinic': {
                label: 'Clinic',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-objects-column', routerLink: ['/clinic/dashboard'] },
                    { label: 'Tenants', icon: 'pi pi-fw pi-building', routerLink: ['/clinic/tenants'] },
                    { label: 'Practitioners', icon: 'pi pi-fw pi-id-card', routerLink: ['/clinic/practitioners'] },
                    { label: 'Patients', icon: 'pi pi-fw pi-users', routerLink: ['/clinic/patients'] },
                    { label: 'Services', icon: 'pi pi-fw pi-briefcase', routerLink: ['/clinic/services'] },
                    { label: 'Appointments', icon: 'pi pi-fw pi-calendar', routerLink: ['/clinic/appointments'] },
                    { label: 'Invoices', icon: 'pi pi-fw pi-file', routerLink: ['/clinic/invoices'] },
                ]
            },
            'Tenant': {
                label: 'Tenant Management',
                items: [
                    { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/pages/tenant/settings'] },
                    { label: 'Products', icon: 'pi pi-fw pi-box', routerLink: ['/pages/tenant/products'] },
                    { label: 'Create Tenant', icon: 'pi pi-fw pi-plus-circle', routerLink: ['/pages/tenant/create'] },
                ]
            },
            'User Management': {
                label: 'User Management',
                items: [
                    { label: 'Manage Users', icon: 'pi pi-fw pi-users', routerLink: ['/pages/users'] },
                    { label: 'Roles & Permissions', icon: 'pi pi-fw pi-shield', routerLink: ['/pages/roles'] },
                ]
            },
        };

        const tenantId = localStorage.getItem('tenantId');
        const orgType = (localStorage.getItem('organizationType') || '').toLowerCase();
        const allowedGroups = this.orgMenuMap[orgType];

        if (tenantId && allowedGroups) {
            // Tenant-scoped user — show only menus for this org type (excluding Home and Tenant)
            const filteredGroups = allowedGroups.filter(key => key !== 'Home' && key !== 'Tenant');
            this.model = filteredGroups
                .filter(key => this.allMenus[key])
                .map(key => this.allMenus[key]);
        } else {
            // No tenantId on token (admin/superuser) — show all menus
            this.model = Object.values(this.allMenus);
        }
    }
}
