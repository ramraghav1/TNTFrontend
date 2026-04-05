import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(private translate: TranslateService) {}

    ngOnInit() {
        // Set up available languages
        this.translate.addLangs(['en', 'np']);
        
        // Set default language
        this.translate.setDefaultLang('en');
        
        // Use language from localStorage or default to English
        const savedLang = localStorage.getItem('language') || 'en';
        this.translate.use(savedLang);
    }
}
