import { inject, Injectable, signal } from '@angular/core';
import { Account } from '../../../models';
import { TransactionsService } from '../../transactions/transactions.service';
import { AuthService } from '../../../auth.service';
import { convertDateToString } from '../../../../utils/convertDateToString';




@Injectable()
export class AccountAjustamentService {
  transactionService = inject(TransactionsService);
  authService = inject(AuthService);
  saving = signal(false);
  visible = signal(false);
  account = signal<Account | null>(null);
  ammount = signal<number | null>(null); // valor que a conta deve ficar  500
  balance = signal(0); // valor atualmente presente na conta 360
  constructor() { }

  async onSave(){
    this.saving.set(true);
    let ajustament = 0;
    console.log(this.ammount())
    const ammount = this.ammount();
    const account = this.account();
    if(ammount == null || !account) return;
    if(account.type == 'debt'){
      if(ammount > this.balance()){
        // quero aumentar o valor do balanço, preciso adicionar um valor positovo que corresponde ao que falta
        ajustament = ammount - this.balance();
      }else{
        // quero diminuir o valor do balaço
        ajustament = (this.balance()  - ammount) * -1;
      }
    }else{
      // ajustar o valor do crédito.
      const negativeAmmount = ammount * -1;
      console.log(negativeAmmount);
      console.log(this.balance());
      if(negativeAmmount > this.balance()){
        console.log('aqui');
        // exemplo o ammount é -500 e o balance é -1000
        // preciso adicionar um valor positivo de 500, ou 500 - 1000 
        ajustament = negativeAmmount - this.balance();
      }else{
        // exemplo o ammount é -2000 e o balance é -1000
        // preciso adicionar um valor negativo de - 1000, o maior valor - o menor valor
        // erro no ajuste de valor quando é para a dívida ficar maior
        ajustament = (this.balance() - negativeAmmount) * -1;
      }
    }
  


    const result = Math.round(this.balance() + ajustament)
    console.log('A transação adicionada será de ' + ajustament)
    console.log('O saldo será de ' + (result) );

    await this.transactionService.saveTransaction({
      date: convertDateToString(new Date),
      title: 'Ajuste de saldo ' + this.account()?.title,
      amount: ajustament,
      spender: null,
      category: null,
      account: this.account()?.id!,
      type: 'adjustment',
      transfer_account: null,
      work: false
    })

    this.saving.set(false);
    this.ammount.set(null);
    this.visible.set(false);
  }



}
