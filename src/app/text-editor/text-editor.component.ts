import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true,
    },
  ],
})
export class TextEditorComponent implements ControlValueAccessor {
  content: string = '';

  @Input() customMenu: string[] = [];
  @ViewChild('editorRef', { static: true })
  editorRef!: ElementRef<HTMLDivElement>;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  /** Apply Formatting using Selection API */

  applyFormatting(tag: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    if (!selectedText) return; // Prevent applying to empty selection

    // Create the list element (ordered or unordered)
    const list = document.createElement(tag);
    const lines = selectedText.split('\n');

    lines.forEach((line) => {
      const listItem = document.createElement('li');
      listItem.textContent = line.trim();
      list.appendChild(listItem);
    });

    range.deleteContents(); // Remove selected text
    range.insertNode(list); // Insert the new list

    // Reset selection after inserting
    selection.removeAllRanges();
    selection.addRange(range);

    this.updateContent();
  }

  /** Insert Image */
  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement('img');
      img.src = reader.result as string;
      img.style.maxWidth = '100%';
      this.insertElement(img);
    };
    reader.readAsDataURL(file);
  }

  /** Insert Custom Value */
  insertCustomValue(value: any) {
    if (!value) return;
    const textNode = document.createTextNode(value.value);
    this.insertElement(textNode);
  }

  /** Insert HTML Elements at Cursor Position */
  insertElement(element: Node) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(element);

    range.setStartAfter(element);
    range.setEndAfter(element);
    selection.removeAllRanges();
    selection.addRange(range);

    this.updateContent();
  }

  /** Update Content & Notify Form */
  updateContent() {
    this.content = this.editorRef.nativeElement.innerHTML;
    this.onChange(this.content);
    this.onTouched();
  }

  /** Clear Editor */
  clear() {
    this.editorRef.nativeElement.innerHTML = '';
    this.content = '';
    this.onChange(this.content);
  }

  /** ControlValueAccessor Methods */
  writeValue(value: string): void {
    this.content = value || '';
    if (this.editorRef) {
      this.editorRef.nativeElement.innerHTML = this.content;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
