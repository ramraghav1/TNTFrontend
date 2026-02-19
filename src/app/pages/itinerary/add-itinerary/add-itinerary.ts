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
interface Permit {
  type: string;
  area: string;
  validFrom: string;
  validTo: string;
}

interface DayItinerary {
  day: number;
  date: string;
  title: string;
  location: string;
  activities: string[];
  accommodation: string;
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean };
  transport: string;
  guide: string;
  permitUsed: string;
}

interface ItineraryForm {
  travelerInfo: {
    fullName: string;
    contactNumber: string;
    email: string;
    nationality: string;
    groupSize: { adults: number; children: number; seniors: number };
  };
  tripDetails: {
    startDate: string;
    endDate: string;
    purpose: string[];
    entryPoint: string;
    exitPoint: string;
    budgetPerPerson: number | null;
    currency: string;
  };
  preferences: {
    accommodation: string;
    transportMode: string;
    mealPreferences: string[];
    languageGuide: string;
    requiresPorter: boolean;
    permitRequired: boolean;
  };
  permits: Permit[];
  itinerary: DayItinerary[];
}

@Component({
  selector: 'app-add-itinerary',
  standalone: true,
  imports: [
    FormsModule, FluidModule, InputTextModule, ButtonModule, SelectModule, TextareaModule,
    MultiSelectModule, CheckboxModule, AccordionModule, CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-itinerary.html',
  styleUrls: ['./add-itinerary.scss']
})
export class AddItinerary {
  form: ItineraryForm = {
    travelerInfo: {
      fullName: '',
      contactNumber: '',
      email: '',
      nationality: '',
      groupSize: { adults: 1, children: 0, seniors: 0 }
    },
    tripDetails: {
      startDate: '',
      endDate: '',
      purpose: [],
      entryPoint: '',
      exitPoint: '',
      budgetPerPerson: null,
      currency: ''
    },
    preferences: {
      accommodation: '',
      transportMode: '',
      mealPreferences: [],
      languageGuide: '',
      requiresPorter: false,
      permitRequired: false
    },
    permits: [],
    itinerary: []
  };

  purposeOptions = [
    { label: 'Leisure', value: 'Leisure' },
    { label: 'Culture', value: 'Culture' },
    { label: 'Adventure', value: 'Adventure' },
    { label: 'Business', value: 'Business' }
  ];

  mealOptions = [
    { label: 'Vegetarian', value: 'Vegetarian' },
    { label: 'Non-Vegetarian', value: 'Non-Vegetarian' },
    { label: 'Vegan', value: 'Vegan' },
    { label: 'Gluten-Free', value: 'Gluten-Free' }
  ];

  addPermit() {
    this.form.permits.push({ type: '', area: '', validFrom: '', validTo: '' });
  }

  addDay() {
    const dayNum = this.form.itinerary.length + 1;
    this.form.itinerary.push({
      day: dayNum,
      date: '',
      title: '',
      location: '',
      activities: [],
      accommodation: '',
      meals: { breakfast: false, lunch: false, dinner: false },
      transport: '',
      guide: '',
      permitUsed: ''
    });
  }

  submitItinerary() {
    // Submit logic here
    console.log(this.form);
  }
  removeDay(index: number) {
    this.form.itinerary.splice(index, 1);
    // Optionally, re-number the days:
    this.form.itinerary.forEach((day, i) => day.day = i + 1);
  }
}