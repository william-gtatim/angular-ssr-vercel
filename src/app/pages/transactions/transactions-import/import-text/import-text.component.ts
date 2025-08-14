import { Component, inject, output, signal } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../../ai.service';
import { TransactionImport } from '../../../../models';
@Component({
  selector: 'app-import-text',
  imports: [TextareaModule, ButtonModule, FormsModule],
  templateUrl: './import-text.component.html',
  styleUrl: './import-text.component.css'
})
export class ImportTextComponent {
  aiService = inject(AiService);
  loading = signal(false);
  text = signal<string>('');
  onParsedata = output<TransactionImport[]>();

  async onImportText() {
    this.loading.set(true);
    const response = await this.aiService.formatTransactions(this.text(), 'text');
    console.log(response.transactions);
    if(response){
      this.onParsedata.emit(response.transactions as TransactionImport[])
    }
    this.loading.set(false);

  }



}
