import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionAddService {
  visible = signal(false);
  transactionId = signal<number | null>(null);
  
  constructor(){
    effect(() => {
      if(this.visible() == false){
        this.transactionId.set(null);
      }
    })
  }

}
