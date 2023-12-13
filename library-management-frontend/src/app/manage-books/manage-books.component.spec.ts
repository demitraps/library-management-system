import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBooksComponent } from './manage-books.component';

describe('ManageBooksComponent', () => {
  let component: ManageBooksComponent;
  let fixture: ComponentFixture<ManageBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageBooksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
