import { Component, inject, output, signal } from '@angular/core';
import { FileUploadComponent } from "../../../../components/shared/file-upload/file-upload.component";
import { AiService } from '../../../../ai.service';

@Component({
  selector: 'app-import-image',
  imports: [FileUploadComponent],
  templateUrl: './import-image.component.html',
  styleUrl: './import-image.component.css'
})
export class ImportImageComponent {
  aiService = inject(AiService);
  onParseData = output<any>();
  loading = signal(false);

  async onUploadImage(image: any){
    this.loading.set(true);
    const base64Image = await this.convertFileToBase64(image);
    const response = await this.aiService.formatTransactions(base64Image, 'image');
    console.log(response);

    this.onParseData.emit(response.transactions);
    this.loading.set(false);
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

}
