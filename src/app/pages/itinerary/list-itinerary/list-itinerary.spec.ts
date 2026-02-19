import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItinerary } from './list-itinerary';

describe('ListItinerary', () => {
  let component: ListItinerary;
  let fixture: ComponentFixture<ListItinerary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListItinerary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItinerary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
