import { Component, input, OnInit, output, ViewChild, ElementRef } from '@angular/core';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-file-upload',
  imports: [LoadingSpinnerComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent implements OnInit {
  fileFormat = input.required<string>();
  loading = input(false);
  onSelect = output<any>();
  label = input.required<string>();

  @ViewChild('fileInputRef') fileInputRef!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    console.log(this.fileFormat());
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.onSelect.emit(file);
      // resetar o valor para permitir seleção do mesmo arquivo novamente
      input.value = '';
    }
  }
}
