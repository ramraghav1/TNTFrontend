import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { environment } from '../../../../environments/environment';

interface CreateItineraryDayRequest {
  dayNumber: number;
  title: string;
  location: string;
  accommodation: string;
  transport: string;
  breakfastIncluded: boolean;
  lunchIncluded: boolean;
  dinnerIncluded: boolean;
  activities: string[];
}

interface CreateItineraryRequest {
  title: string;
  description: string;
  durationDays: number;
  difficultyLevel: string;
  days: CreateItineraryDayRequest[];
}

@Component({
  selector: 'app-add-itinerary',
  standalone: true,
  imports: [
    FormsModule, FluidModule, InputTextModule, ButtonModule, SelectModule, TextareaModule,
    MultiSelectModule, CheckboxModule, AccordionModule, CommonModule, HttpClientModule, Toast
  ],
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-itinerary.html',
  styleUrls: ['./add-itinerary.scss']
})
export class AddItinerary {
  form: CreateItineraryRequest = {
    title: '',
    description: '',
    durationDays: 0,
    difficultyLevel: '',
    days: []
  };

  difficultyLevelOptions = [
    { label: 'Easy', value: 'Easy' },
    { label: 'Moderate', value: 'Moderate' },
    { label: 'Hard', value: 'Hard' }
  ];

  activityOptions = [
    { label: 'Hiking', value: 'Hiking' },
    { label: 'Sightseeing', value: 'Sightseeing' },
    { label: 'Cultural Tour', value: 'Cultural Tour' },
    { label: 'Adventure Sports', value: 'Adventure Sports' },
    { label: 'Relaxation', value: 'Relaxation' }
  ];

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  addDay() {
    const dayNum = this.form.days.length + 1;
    this.form.days.push({
      dayNumber: dayNum,
      title: '',
      location: '',
      accommodation: '',
      transport: '',
      breakfastIncluded: false,
      lunchIncluded: false,
      dinnerIncluded: false,
      activities: []
    });
  }

  removeDay(index: number) {
    this.form.days.splice(index, 1);
    this.form.days.forEach((day, i) => day.dayNumber = i + 1);
  }

  submitItinerary() {
    if (!this.form.title || !this.form.durationDays || this.form.days.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }

    this.http.post(`${environment.apiBaseUrl}/Itineraries/create`, this.form).subscribe(
      (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Itinerary created successfully' });
        this.resetForm();
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create itinerary' });
        console.error(error);
      }
    );
  }

  resetForm() {
    this.form = {
      title: '',
      description: '',
      durationDays: 0,
      difficultyLevel: '',
      days: []
    };
  }
}