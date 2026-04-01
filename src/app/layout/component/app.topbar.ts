import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { Popover, PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NotificationService, Notification } from '@/app/layout/service/notification.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, MenuModule, BadgeModule, OverlayBadgeModule, PopoverModule, ButtonModule],
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
                    <div class="relative">
                        <button type="button" class="layout-topbar-action" (click)="toggleNotifications(notifPopover, $event)">
                            @if (notificationService.unreadCount() > 0) {
                                <p-overlaybadge [value]="notificationService.unreadCount().toString()" severity="danger">
                                    <i class="pi pi-bell" style="font-size: 1.25rem"></i>
                                </p-overlaybadge>
                            } @else {
                                <i class="pi pi-bell" style="font-size: 1.25rem"></i>
                            }
                            <span>Notifications</span>
                        </button>

                        <p-popover #notifPopover [style]="{ width: '420px' }" styleClass="notification-popover">
                            <!-- Header -->
                            <div class="flex items-center justify-between mb-4">
                                <span class="font-semibold text-xl">Notifications</span>
                                @if (notificationService.hasUnread()) {
                                    <button pButton type="button" label="Mark all read" class="p-button-text p-button-sm p-button-plain" icon="pi pi-check-circle" (click)="notificationService.markAllAsRead()"></button>
                                }
                            </div>

                            <!-- Notification List -->
                            <div style="max-height: 400px; overflow-y: auto; margin: 0 -1.25rem; padding: 0 1.25rem;">
                                @for (notif of notificationService.notifications(); track notif.id) {
                                    <div class="flex items-center py-3 cursor-pointer notification-item"
                                         [class.border-b]="!$last"
                                         [class.border-surface]="!$last"
                                         [class.notification-unread]="!notif.isRead"
                                         (click)="onNotificationClick(notif)">
                                        <div class="w-12 h-12 flex items-center justify-center rounded-full mr-4 shrink-0"
                                             [ngClass]="getNotifIconBgClass(notif.type)">
                                            <i [ngClass]="['pi', getNotifIcon(notif), 'text-xl!', getNotifIconColorClass(notif.type)]"></i>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <span class="text-surface-900 dark:text-surface-0 font-medium leading-normal block">{{ notif.title }}</span>
                                            <span class="text-surface-700 dark:text-surface-100 text-sm leading-normal block mt-0.5">{{ notif.message }}</span>
                                            <span class="text-muted-color text-xs block mt-1">{{ getTimeAgo(notif.createdAt) }}</span>
                                        </div>
                                        <button class="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors ml-2"
                                                (click)="onDeleteNotification($event, notif.id)" title="Remove">
                                            <i class="pi pi-times text-sm text-muted-color hover:text-red-500"></i>
                                        </button>
                                    </div>
                                } @empty {
                                    <div class="py-8 text-center text-muted-color">
                                        <i class="pi pi-bell-slash text-4xl mb-3 block text-surface-400"></i>
                                        <span class="block text-lg font-medium">No notifications</span>
                                        <span class="block text-sm mt-1">You're all caught up!</span>
                                    </div>
                                }
                            </div>
                        </p-popover>
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
    </div>`,
    styles: [`
        :host ::ng-deep .notification-popover {
            .p-popover-content {
                padding: 1.25rem;
            }
        }

        .notification-item {
            transition: background-color 0.2s;
            border-radius: var(--content-border-radius);
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            margin: 0 -0.5rem;
        }

        .notification-item:hover {
            background-color: var(--surface-hover);
        }

        .notification-unread {
            position: relative;
            background-color: var(--p-primary-50, rgba(var(--primary-500), 0.05));
        }

        .notification-unread::before {
            content: '';
            position: absolute;
            left: 0px;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 60%;
            border-radius: 0 4px 4px 0;
            background-color: var(--primary-color);
        }

        :host ::ng-deep .layout-topbar-action .p-overlaybadge .p-badge {
            font-size: 0.625rem;
            min-width: 1.15rem;
            height: 1.15rem;
            line-height: 1.15rem;
        }
    `]
})
export class AppTopbar {
    items!: MenuItem[];
    profileMenuItems: MenuItem[] = [];
    userFullName: string = '';
    layoutService = inject(LayoutService);
    notificationService = inject(NotificationService);
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

        // Connect to notifications if logged in
        if (localStorage.getItem('accessToken')) {
            this.notificationService.connect();
        }
    }

    toggleNotifications(popover: Popover, event: Event) {
        event.stopPropagation();
        this.notificationService.loadNotifications();
        popover.toggle(event);
    }

    onNotificationClick(notif: Notification) {
        if (!notif.isRead) {
            this.notificationService.markAsRead(notif.id);
        }
        if (notif.link) {
            this.router.navigate([notif.link]);
        }
    }

    onDeleteNotification(event: Event, id: number) {
        event.stopPropagation();
        this.notificationService.deleteNotification(id);
    }

    /** Return Sakai-style icon based on notification type */
    getNotifIcon(notif: Notification): string {
        if (notif.icon) return notif.icon;
        const iconMap: Record<string, string> = {
            'transaction': 'pi-dollar',
            'payment': 'pi-dollar',
            'booking': 'pi-calendar',
            'info': 'pi-info-circle',
            'warning': 'pi-exclamation-triangle',
            'success': 'pi-check-circle',
            'user': 'pi-user',
            'message': 'pi-envelope',
            'system': 'pi-cog',
            'reminder': 'pi-clock',
        };
        return iconMap[notif.type?.toLowerCase()] || 'pi-bell';
    }

    /** Background class for the circular icon container */
    getNotifIconBgClass(type: string): string {
        const bgMap: Record<string, string> = {
            'transaction': 'bg-blue-100 dark:bg-blue-400/10',
            'payment': 'bg-blue-100 dark:bg-blue-400/10',
            'booking': 'bg-orange-100 dark:bg-orange-400/10',
            'info': 'bg-cyan-100 dark:bg-cyan-400/10',
            'warning': 'bg-orange-100 dark:bg-orange-400/10',
            'success': 'bg-green-100 dark:bg-green-400/10',
            'user': 'bg-purple-100 dark:bg-purple-400/10',
            'message': 'bg-indigo-100 dark:bg-indigo-400/10',
            'system': 'bg-gray-100 dark:bg-gray-400/10',
            'reminder': 'bg-pink-100 dark:bg-pink-400/10',
        };
        return bgMap[type?.toLowerCase()] || 'bg-primary-100 dark:bg-primary-400/10';
    }

    /** Text color class for the icon */
    getNotifIconColorClass(type: string): string {
        const colorMap: Record<string, string> = {
            'transaction': 'text-blue-500',
            'payment': 'text-blue-500',
            'booking': 'text-orange-500',
            'info': 'text-cyan-500',
            'warning': 'text-orange-500',
            'success': 'text-green-500',
            'user': 'text-purple-500',
            'message': 'text-indigo-500',
            'system': 'text-gray-500',
            'reminder': 'text-pink-500',
        };
        return colorMap[type?.toLowerCase()] || 'text-primary';
    }

    /** Human-readable relative time */
    getTimeAgo(dateStr: string): string {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr = Math.floor(diffMs / 3600000);
        const diffDay = Math.floor(diffMs / 86400000);

        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin} min ago`;
        if (diffHr < 24) return `${diffHr} hr ago`;
        if (diffDay === 1) return 'Yesterday';
        if (diffDay < 7) return `${diffDay} days ago`;
        return date.toLocaleDateString();
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
