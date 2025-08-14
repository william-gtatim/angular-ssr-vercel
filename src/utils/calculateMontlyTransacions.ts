 import { Transaction } from "../app/models";
type TotalExpenseIncome = {
    expense: number,
    income: number
}

 export function calculateMontlyTransacions(transactions: Transaction[], date: string): TotalExpenseIncome {
    const [currentYear, currentMonth] = date.split('-');
    let totalExpense = 0;
    let totalIncome = 0;

    transactions.forEach((transaction: Transaction) => {
      const [yearStr, monthStr] = transaction.date.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);

      if (year === parseInt(currentYear) && month === parseInt(currentMonth)) {
        if(transaction.type !== 'transfer' && transaction.type !== 'adjustment'){
          if (transaction.amount < 0) {
            totalExpense += transaction.amount;
          } else {
            totalIncome += transaction.amount;
          }
        }
      }
    });

    return { expense: totalExpense, income: totalIncome };
  }
