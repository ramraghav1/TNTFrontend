import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';

interface Itinerary {
  id: number;
  title: string;
  description: string;
  durationDays: number;
  difficultyLevel: string;
}

@Component({
  selector: 'app-itinerary-list',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    ConfirmDialogModule,
    DialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './itinerary-list.html'
})
export class ItineraryList implements OnInit {
  itineraries: Itinerary[] = [];
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadItineraries();
  }

  loadItineraries() {
    this.loading = true;
    this.http.get<Itinerary[]>(`${environment.apiBaseUrl}/Itineraries/list`)
      .subscribe({
        next: (data) => {
          this.itineraries = data;
          this.loading = false;

          // ✅ Trigger change detection manually to avoid NG0100
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load itineraries' });

          this.cdr.detectChanges();
        }
      });
  }

  viewDetails(itinerary: Itinerary) {
    this.router.navigate(['itinerary-details', itinerary.id]);
  }

  editItinerary(itinerary: Itinerary) {
    this.messageService.add({ severity: 'info', summary: 'Edit', detail: `Edit itinerary ${itinerary.title}` });
  }

  deleteItinerary(itinerary: Itinerary) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${itinerary.title}"?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.itineraries = this.itineraries.filter(i => i.id !== itinerary.id);
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: `Itinerary ${itinerary.title} deleted` });

        this.cdr.detectChanges(); // Make sure view updates
      }
    });
  }
}