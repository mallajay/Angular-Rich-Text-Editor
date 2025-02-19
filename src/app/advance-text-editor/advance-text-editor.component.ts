import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  forwardRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-advance-text-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './advance-text-editor.component.html',
  styleUrl: './advance-text-editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdvanceTextEditorComponent),
      multi: true,
    },
  ],
})
export class AdvanceTextEditorComponent
  implements ControlValueAccessor, AfterViewInit
{
  content: string = '';
  @Input() customMenu: string[] = [];
  @ViewChild('editorRef', { static: true })
  editorRef!: ElementRef<HTMLDivElement>;
  selectedImage: HTMLImageElement | null = null;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor(private readonly renderer: Renderer2) {}

  ngAfterViewInit() {
    this.renderer.listen(this.editorRef.nativeElement, 'click', (event) => {
      if (event.target.tagName === 'IMG') {
        this.selectImage(event.target);
      } else {
        this.selectedImage = null;
      }
    });
  }

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

  applyTextAlignment(alignment: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let selectedElement = range.commonAncestorContainer as HTMLElement;

    if (selectedElement.nodeType === Node.TEXT_NODE) {
      selectedElement = selectedElement.parentElement as HTMLElement;
    }

    // If selected element is an image, apply alignment directly
    if (selectedElement && selectedElement.tagName === 'IMG') {
      selectedElement.style.display = 'block';
      selectedElement.style.margin = alignment === 'center' ? 'auto' : '';
      selectedElement.style.float =
        alignment === 'left'
          ? 'left'
          : alignment === 'right'
          ? 'right'
          : 'none';
    } else if (selectedElement) {
      selectedElement.style.textAlign = alignment;
    }

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
      img.style.cursor = 'nwse-resize';
      img.style.cursor = 'pointer';
      img.style.resize = 'both';
      img.style.overflow = 'hidden';
      img.style.border = '2px dashed gray';

      this.insertElement(img);
    };
    reader.readAsDataURL(file);
  }

  /** Insert Custom Value */
  insertCustomValue(event: any) {
    let value = event.target.value;

    if (!value) return;
    const textNode = document.createTextNode(value);
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

  /** Select Image for Resizing */
  selectImage(image: HTMLImageElement) {
    this.selectedImage = image;
    this.selectedImage.style.border = '2px solid blue';
    this.enableResizeHandles();
  }

  /** Enable Image Resize */
  enableResizeHandles() {
    if (!this.selectedImage) return;

    let startX = 0,
      startY = 0,
      startWidth = 0,
      startHeight = 0;

    const onMouseMove = (event: MouseEvent) => {
      if (!this.selectedImage) return;
      const width = startWidth + (event.clientX - startX);
      const height = startHeight + (event.clientY - startY);
      this.selectedImage.style.width = `${width}px`;
      this.selectedImage.style.height = `${height}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      this.updateContent();
    };

    this.selectedImage.addEventListener('mousedown', (event: MouseEvent) => {
      event.preventDefault();
      startX = event.clientX;
      startY = event.clientY;
      startWidth = this.selectedImage!.offsetWidth;
      startHeight = this.selectedImage!.offsetHeight;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    this.updateImageSize(this.selectedImage);
  }

  // Update image size in the editor output
  updateImageSize(image: HTMLImageElement) {
    const width = image.clientWidth;
    const height = image.clientHeight;

    image.setAttribute('width', `${width}px`);
    image.setAttribute('height', `${height}px`);

    this.updateContent();
  }

  /** Update Content in FormControl */
  // updateContent() {
  //   this.content = this.editorRef.nativeElement.innerHTML;
  //   this.onChange(this.content);
  //   this.onTouched();
  // }

  /** Ensure Images & Text are inline */
  updateContent() {
    const editor = this.editorRef.nativeElement;
    const nodes = Array.from(editor.childNodes);

    nodes.forEach((node, index) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'IMG') {
        const prevNode = nodes[index - 1];
        const nextNode = nodes[index + 1];

        if (
          (prevNode && prevNode.nodeType === Node.TEXT_NODE) ||
          (nextNode && nextNode.nodeType === Node.TEXT_NODE)
        ) {
          // Create wrapper for flex layout
          const wrapper = document.createElement('div');
          wrapper.classList.add('inline-container'); // CSS class for styling
          wrapper.style.display = 'flex';
          wrapper.style.alignItems = 'center';
          wrapper.style.gap = '8px';

          if (prevNode && prevNode.nodeType === Node.TEXT_NODE) {
            wrapper.appendChild(prevNode.cloneNode(true)); // Clone instead of moving
          }

          wrapper.appendChild(node.cloneNode(true)); // Clone the image

          if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
            wrapper.appendChild(nextNode.cloneNode(true));
          }

          // Ensure the node still exists before replacing
          if (editor.contains(node)) {
            editor.replaceChild(wrapper, node);
          }
        }
      }
    });

    // Store editor content
    this.content = editor.innerHTML;
    this.onChange(this.content);
    this.onTouched();
  }

  /** Clear Editor */
  clear() {
    const editor = this.editorRef.nativeElement;

    // Remove all content inside the editor
    editor.innerHTML = '';

    // Reset stored content
    this.content = '';

    // Reset formatting (alignment, styles)
    editor.removeAttribute('style');
    editor.classList.remove('text-left', 'text-center', 'text-right'); // Remove alignment classes if any

    // Notify Angular form control
    this.onChange(this.content);
    this.onTouched();
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
