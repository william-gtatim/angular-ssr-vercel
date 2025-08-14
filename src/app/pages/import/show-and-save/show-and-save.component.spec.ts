import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAndSaveComponent } from './show-and-save.component';

describe('ShowAndSaveComponent', () => {
  let component: ShowAndSaveComponent;
  let fixture: ComponentFixture<ShowAndSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAndSaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAndSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
