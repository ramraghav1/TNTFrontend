import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../shared/services/translation.service';

interface Language {
  code: string;
  name: string;
  displayName: string;
  emoji: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule, Select, FormsModule],
  template: `
    <p-select 
      [options]="languages" 
      [(ngModel)]="selectedLanguage"
      (onChange)="onLanguageChange($event)"
      optionLabel="displayName"
      optionValue="code"
      [style]="{'min-width': '180px'}">
    </p-select>
  `,
  styles: [`
    :host ::ng-deep {
      .p-select {
        min-width: 150px;
      }
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  languages: Language[] = [
    { code: 'en', name: 'English', displayName: '🇺🇸 English', emoji: '🇺🇸' },
    { code: 'np', name: 'नेपाली', displayName: '🇳🇵 नेपाली', emoji: '🇳🇵' }
  ];

  selectedLanguage: string = 'en';

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.selectedLanguage = this.translationService.getCurrentLanguage();
  }

  onLanguageChange(event: any): void {
    this.translationService.setLanguage(event.value);
  }

  get currentLanguage(): Language | undefined {
    return this.languages.find(lang => lang.code === this.selectedLanguage);
  }
}
