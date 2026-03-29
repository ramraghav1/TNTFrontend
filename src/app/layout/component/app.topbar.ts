import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { MenuModule } from 'primeng/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, MenuModule],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="/images/suryantra-logo-transparent.svg" alt="Suryantra Technologies" style="height: 56px; width: auto; margin-top: -2px;" />
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action" (click)="profileMenu.toggle($event)">
                        <i class="pi pi-user"></i>
                        <span>{{ userFullName || 'Profile' }}</span>
                    </button>
                    <p-menu #profileMenu [model]="profileMenuItems" [popup]="true" />
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    items!: MenuItem[];
    profileMenuItems: MenuItem[] = [];
    userFullName: string = '';

    layoutService = inject(LayoutService);
    private router = inject(Router);
    private http = inject(HttpClient);
    private cdr = inject(ChangeDetectorRef);

    constructor() {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            this.userFullName = userInfo?.userFullName || '';
        } catch { }

        this.profileMenuItems = [
            {
                label: this.userFullName || 'User',
                items: [
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        command: () => this.logout()
                    }
                ]
            }
        ];
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    logout() {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            this.http.post(`${environment.serverBaseUrl}/api/Login/logout`, { refreshToken })
                .subscribe({
                    next: () => this.clearAndRedirect(),
                    error: () => this.clearAndRedirect()
                });
        } else {
            this.clearAndRedirect();
        }
    }

    private clearAndRedirect() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('organizationType');
        localStorage.removeItem('userInfo');
        this.router.navigate(['/login']);
        this.cdr.detectChanges();
    }
}
