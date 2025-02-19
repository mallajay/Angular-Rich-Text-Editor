# Advance Text Editor

![Advance Text Editor](https://raw.githubusercontent.com/mallajay/Angular-Rich-Text-Editor/refs/heads/master/img.png)


A powerful, lightweight, and customizable rich text editor component for **Angular**. This editor provides advanced text formatting, image insertion, alignment options, and seamless integration with Angular forms.

## Features

- **Customizable Toolbar**: Supports dynamic formatting options.
- **Text Formatting**: Bold, italic, underline, lists, and alignment.
- **Image Upload & Resize**: Easily insert and resize images.
- **Selection API**: Apply styles to selected text.
- **Reactive Forms Support**: Implements `ControlValueAccessor` for seamless form integration.
- **Standalone Component**: Can be used independently in Angular projects.

---

## Usage

### Basic Usage

```html
<app-advance-text-editor [(ngModel)]="editorContent"></app-advance-text-editor>
```

```typescript
export class MyComponent {
  editorContent = "<p>Hello, World!</p>";
}
```

### Custom Menu Options

```html
<app-advance-text-editor [customMenu]="['bold', 'italic', 'underline']"></app-advance-text-editor>
```

---

## API Reference

### Inputs

| Property     | Type       | Default | Description                            |
| ------------ | ---------- | ------- | -------------------------------------- |
| `customMenu` | `string[]` | `[]`    | List of formatting options to display. |

### Outputs

| Event         | Description                                          |
| ------------- | ---------------------------------------------------- |
| `valueChange` | Emits updated content whenever the text is modified. |

---

## Methods

### `applyFormatting(tag: string)`

Applies a specific formatting to the selected text.

### `applyTextAlignment(alignment: string)`

Aligns selected text or images (`left`, `center`, `right`).

### `onImageUpload(event: Event)`

Handles image uploads and inserts them into the editor.

### `insertCustomValue(event: any)`

Inserts custom values into the editor.

### `clear()`

Clears the editor content.

---

## Customization

### Styling

You can customize the editor styles via CSS:

```scss
.advance-text-editor {
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 200px;
}
```

### Extending Functionality

You can extend the component by modifying `advance-text-editor.component.ts` to add new features like font selection, background colors, etc.

---

## Live Demo

Check out the live demo on StackBlitz: [Angular Rich Text Editor](https://stackblitz.com/~/github.com/mallajay/Angular-Rich-Text-Editor)

---

## Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a new Pull Request

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Support

If you find this project useful, please ⭐ the repository and share it!

For any issues or suggestions, open an issue on [GitHub](https://github.com/your-repository/issues).
