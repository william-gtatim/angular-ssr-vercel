import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportOfxComponent } from './import-ofx.component';

describe('ImportOfxComponent', () => {
  let component: ImportOfxComponent;
  let fixture: ComponentFixture<ImportOfxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportOfxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportOfxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
