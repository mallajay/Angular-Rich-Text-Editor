import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AdvanceTextEditorComponent } from './advance-text-editor/advance-text-editor.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, AdvanceTextEditorComponent],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  form = new FormGroup({
    editorContent: new FormControl(''),
  });

  customOptions = ['Hello', 'World', 'Angular', 'Editor'];

  submitForm() {
    console.log('Editor Content:', this.form.value.editorContent);
  }
}
