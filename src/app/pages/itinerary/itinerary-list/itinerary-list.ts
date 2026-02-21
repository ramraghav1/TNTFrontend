import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { FluidModule } from 'primeng/fluid';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';

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
    TableModule,
    ButtonModule,
    InputTextModule,
    Toast,
    ConfirmDialog,
    Dialog,
    FluidModule,
    TooltipModule,
    RouterModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './itinerary-list.html',
  styleUrl: './itinerary-list.scss',
})
export class ItineraryList implements OnInit {
  itineraries: Itinerary[] = [];
  loading: boolean = false;
  selectedItinerary: Itinerary | null = null;
  showDetailsDialog: boolean = false;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadItineraries();
  }

  loadItineraries() {
    this.loading = true;
    this.http.get<Itinerary[]>('https://localhost:7236/api/Itineraries/list').subscribe(
      (data: Itinerary[]) => {
        this.itineraries = data;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Itineraries loaded successfully'
        });
      },
      (error) => {
        this.loading = false;
        console.error('Error loading itineraries:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load itineraries'
        });
      }
    );
  }

  viewDetails(itinerary: Itinerary) {
    this.selectedItinerary = itinerary;
    this.showDetailsDialog = true;
  }

  editItinerary(itinerary: Itinerary) {
    console.log('Edit itinerary:', itinerary);
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Edit functionality coming soon'
    });
  }

  deleteItinerary(itinerary: Itinerary) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${itinerary.title}"?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.delete(`https://localhost:7236/api/Itineraries/${itinerary.id}`).subscribe(
          () => {
            this.itineraries = this.itineraries.filter(i => i.id !== itinerary.id);
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Itinerary deleted successfully'
            });
          },
          (error) => {
            console.error('Error deleting itinerary:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete itinerary'
            });
          }
        );
      }
    });
  }

  closeDetailsDialog() {
    this.showDetailsDialog = false;
    this.selectedItinerary = null;
  }
}
