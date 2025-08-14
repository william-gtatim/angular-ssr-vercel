import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { XMLParser } from 'fast-xml-parser';
import { TransactionsService } from '../../../../pages/transactions/transactions.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../../../auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';


type TransactionOFX = {
  TRNTYPE: 'DEBIT' | 'CREDIT',
  DTPOSTED: string,
  TRNAMT: string,
  FITID: string,
  MEMO: string
}

@Component({
  selector: 'app-transaction-ofx-import',
  imports: [FileUploadModule, ButtonModule, LoadingSpinnerComponent, CheckboxModule, FormsModule, TooltipModule],
  templateUrl: './transaction-ofx-import.component.html',
  styleUrl: './transaction-ofx-import.component.css'
})
export class TransactionOfxImportComponent {
  authService = inject(AuthService);
  transactionService = inject(TransactionsService);
  fileName: string | null = null;
  transactions: any = null;
  saving = signal<boolean>(false);
  ignoreDuplicates = signal(false);

  async onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;

      try {
        const result = await this.parseOfxFile(file);
        if (result) {
          const transactions: TransactionOFX[] = this.extractTransactions(result);
          this.saveTransactions(transactions);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  async parseOfxFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        try {
          const content = event.target.result;

          // Criando um parser com as opções do fast-xml-parser
          const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
          });

          // Convertendo XML para JSON
          const parsedData = parser.parse(content);
          resolve(parsedData);
        } catch (error) {
          reject('Erro ao processar o arquivo OFX.');
        }
      };

      reader.onerror = () => reject('Erro ao ler o arquivo.');
      reader.readAsText(file);
    });
  }

  extractTransactions(parsedData: any): TransactionOFX[] {
    try {
      // Extraindo transações de conta bancária
      const bankTransactions = parsedData.OFX?.BANKMSGSRSV1?.STMTTRNRS?.STMTRS?.BANKTRANLIST?.STMTTRN || [];

      // Extraindo transações de cartão de crédito
      const creditCardTransactions = parsedData.OFX?.CREDITCARDMSGSRSV1?.CCSTMTTRNRS?.CCSTMTRS?.BANKTRANLIST?.STMTTRN || [];

      // Combinar ambas as transações em um único array
      const transactions = [...bankTransactions, ...creditCardTransactions];

      return transactions;
    } catch (error) {
      console.error("Erro ao extrair transações:", error);
      return [];
    }
  }

  formatOFXDate(ofxDate: string | number): string {
    const dateStr = String(ofxDate);
    // Encontra a primeira sequência de 8 dígitos (padrão OFX para data)
    const dateMatch = dateStr.match(/\d{8}/);

    if (!dateMatch) {
      console.error("Data inválida:", ofxDate);
      return "";
    }

    const [year, month, day] = [
      dateMatch[0].slice(0, 4),
      dateMatch[0].slice(4, 6),
      dateMatch[0].slice(6, 8)
    ];

    return `${year}-${month}-${day}`;
  }

  async saveTransactions(OFXTransactions: TransactionOFX[]) {
   
    this.saving.set(true);

    for (const item of OFXTransactions) {
      
      const transaction = {
        date: this.formatOFXDate(item.DTPOSTED),
        amount: parseFloat(item.TRNAMT),
        title: item.MEMO,
        categories: [],
        comment: item.MEMO,
        spender: this.authService.familyMembers().find(item => item.name === 'Eu')!.id
      };

      if(this.ignoreDuplicates()){
        const exists = this.transactionService.getTransactions().some(item =>
          item.date.trim() == transaction.date.trim() && item.amount == transaction.amount

        );


        if (exists) continue;
      }
      

      //await this.transactionService.saveTransaction(transaction);
    }

    this.saving.set(false);
  }
}
