import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceTextEditorComponent } from './advance-text-editor.component';

describe('AdvanceTextEditorComponent', () => {
  let component: AdvanceTextEditorComponent;
  let fixture: ComponentFixture<AdvanceTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceTextEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
