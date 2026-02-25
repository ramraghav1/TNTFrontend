import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AccordionModule } from 'primeng/accordion';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

interface ItineraryDay {
  id: number;
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

interface ItineraryDetail {
  id: number;
  title: string;
  description: string;
  durationDays: number;
  difficultyLevel: string;
  days: ItineraryDay[];
}

@Component({
  selector: 'app-itinerary-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, AccordionModule, TagModule, ProgressSpinnerModule],
  templateUrl: './itinerary-details.html',
  styleUrls: ['./itinerary-details.scss']
})
export class ItineraryDetailsComponent implements OnInit {

  itinerary?: ItineraryDetail;
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }

    this.http.get<ItineraryDetail>(`${environment.apiBaseUrl}/Itineraries/detail?id=${id}`)
      .subscribe({
        next: (res) => {
          this.itinerary = res;
          this.loading = false;
          this.cd.detectChanges(); // Force UI update
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cd.detectChanges();
        }
      });
  }

  // Optional: color tags based on difficulty
  getDifficultySeverity(level: string) {
    switch (level.toLowerCase()) {
      case 'easy': return 'success';
      case 'moderate': return 'secondary';
      case 'hard': return 'danger';
      default: return 'info';
    }
  }
}