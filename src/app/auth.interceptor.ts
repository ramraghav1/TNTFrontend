import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const token = localStorage.getItem('accessToken');

    // Skip token for login and demo request submit endpoints
    const skipUrls = ['/login', '/DemoRequest/submit', '/api/Login/refresh'];
    const shouldSkip = skipUrls.some(url => req.url.includes(url));

    if (token && !shouldSkip) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Token expired or invalid — clear storage and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('organizationType');
                localStorage.removeItem('userInfo');
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
