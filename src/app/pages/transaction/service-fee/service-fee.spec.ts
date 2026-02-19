import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFee } from './service-fee';

describe('ServiceFee', () => {
  let component: ServiceFee;
  let fixture: ComponentFixture<ServiceFee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceFee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceFee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
