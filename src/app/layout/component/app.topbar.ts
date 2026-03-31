import { Component, inject, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { MenuModule } from 'primeng/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BadgeModule } from 'primeng/badge';
import { NotificationService, Notification } from '@/app/layout/service/notification.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, MenuModule, BadgeModule, DatePipe],
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
                    <!-- Notification Bell -->
                    <div class="relative" #notifContainer>
                        <button type="button" class="layout-topbar-action" (click)="toggleNotifications($event)">
                            <i class="pi pi-bell" pBadge
                               [value]="notificationService.unreadCount() > 0 ? notificationService.unreadCount().toString() : ''"
                               [severity]="'danger'"
                               [style]="{ fontSize: '1.25rem' }"></i>
                            <span>Notifications</span>
                        </button>

                        @if (showNotifications) {
                            <div class="notification-panel absolute right-0 top-full mt-1 bg-surface-0 dark:bg-surface-900 border border-surface rounded-lg shadow-lg z-50"
                                 style="width: 380px; max-height: 480px; overflow: hidden;">
                                <!-- Header -->
                                <div class="flex items-center justify-between px-4 py-3 border-b border-surface">
                                    <span class="font-semibold text-lg">Notifications</span>
                                    @if (notificationService.hasUnread()) {
                                        <button class="text-primary text-sm hover:underline cursor-pointer" (click)="notificationService.markAllAsRead()">
                                            Mark all as read
                                        </button>
                                    }
                                </div>

                                <!-- Notification List -->
                                <div style="max-height: 400px; overflow-y: auto;">
                                    @for (notif of notificationService.notifications(); track notif.id) {
                                        <div class="flex items-start gap-3 px-4 py-3 border-b border-surface hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
                                             [class.bg-primary-50]="!notif.isRead"
                                             [class.dark:bg-primary-900/20]="!notif.isRead"
                                             (click)="onNotificationClick(notif)">
                                            <div class="flex-shrink-0 mt-1">
                                                <i [class]="'pi ' + (notif.icon || 'pi-info-circle')" class="text-xl text-primary"></i>
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <div class="font-medium text-sm">{{ notif.title }}</div>
                                                <div class="text-sm text-muted-color mt-0.5 truncate">{{ notif.message }}</div>
                                                <div class="text-xs text-muted-color mt-1">{{ notif.createdAt | date:'short' }}</div>
                                            </div>
                                            <button class="flex-shrink-0 p-1 hover:text-red-500 transition-colors" (click)="onDeleteNotification($event, notif.id)" title="Delete">
                                                <i class="pi pi-times text-sm"></i>
                                            </button>
                                        </div>
                                    } @empty {
                                        <div class="px-4 py-8 text-center text-muted-color">
                                            <i class="pi pi-bell-slash text-4xl mb-2 block"></i>
                                            <span>No notifications</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>

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
    showNotifications = false;

    layoutService = inject(LayoutService);
    notificationService = inject(NotificationService);
    private router = inject(Router);
    private http = inject(HttpClient);
    private cdr = inject(ChangeDetectorRef);
    private el = inject(ElementRef);

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

        // Connect to notifications if logged in
        if (localStorage.getItem('accessToken')) {
            this.notificationService.connect();
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        if (this.showNotifications && !this.el.nativeElement.querySelector('.notification-panel')?.contains(event.target as Node)) {
            // Check if click was on the bell button
            const bellButton = this.el.nativeElement.querySelector('[title="notif-bell"]');
            if (!bellButton?.contains(event.target as Node)) {
                this.showNotifications = false;
            }
        }
    }

    toggleNotifications(event: Event) {
        event.stopPropagation();
        this.showNotifications = !this.showNotifications;
        if (this.showNotifications) {
            this.notificationService.loadNotifications();
        }
    }

    onNotificationClick(notif: Notification) {
        if (!notif.isRead) {
            this.notificationService.markAsRead(notif.id);
        }
        if (notif.link) {
            this.router.navigate([notif.link]);
            this.showNotifications = false;
        }
    }

    onDeleteNotification(event: Event, id: number) {
        event.stopPropagation();
        this.notificationService.deleteNotification(id);
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
        this.notificationService.disconnect();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('organizationType');
        localStorage.removeItem('userInfo');
        this.router.navigate(['/login']);
        this.cdr.detectChanges();
    }
}
