import { Component, inject, output, signal } from '@angular/core';
import { PageTemplateComponent } from "../../../components/page-template/page-template.component";
import { HeaderBackComponent } from "../../../components/header-back/header-back.component";

import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { XMLParser } from 'fast-xml-parser';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadComponent } from '../../../components/shared/file-upload/file-upload.component';
import { TransactionImport } from '../../../models';
import { AuthService } from '../../../auth.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { CardComponent } from "../../../components/card/card.component";
import { ShowAndSaveComponent } from "../show-and-save/show-and-save.component";

type TransactionOFX = {
  TRNTYPE: 'DEBIT' | 'CREDIT',
  DTPOSTED: string,
  TRNAMT: string,
  FITID: string,
  MEMO: string
}

@Component({
  selector: 'app-import-ofx',
  imports: [PageTemplateComponent, HeaderBackComponent, FileUploadComponent, CardComponent, ShowAndSaveComponent],
  templateUrl: './import-ofx.component.html',
  styleUrl: './import-ofx.component.css'
})
export class ImportOfxComponent {
  authService = inject(AuthService);
  transactionService = inject(TransactionsService);
  fileName: string | null = null;
  transactions: any = null;
  saving = signal<boolean>(false);
  ignoreDuplicates = signal(false);
  transacions = signal<TransactionImport[]>([]);


  async onFileSelect(file: any) {
    this.fileName = file.name;
    try {
      const result = await this.parseOfxFile(file);
      if (result) {
        const transactions = this.extractTransactions(result);
        console.log(transactions);
        this.transacions.set(transactions.map(item => ({
          date: this.formatOFXDate(item.DTPOSTED),
          amount: parseFloat(item.TRNAMT),
          title: item.MEMO || item.NAME || "Transação sem descrição"
        })))
      }
    } catch (error) {
      console.error(error);
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

  extractTransactions(parsedData: any) {
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

  
}
