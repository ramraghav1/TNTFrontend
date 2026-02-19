import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendTransaction } from './send-transaction';

describe('SendTransaction', () => {
  let component: SendTransaction;
  let fixture: ComponentFixture<SendTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendTransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendTransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
