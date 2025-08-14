import { Transaction } from "../app/models";

type TotalExpenseIncome = {
    expense: number;
    income: number;
};

/**
 * Calcula o total de despesas e receitas a partir de uma lista de transações.
 *
 * - Ignora transações do tipo `"transfer"`, pois elas não representam entrada ou saída real de dinheiro.
 * - Considera valores negativos como despesas e positivos como receitas.
 *
 * @param transactions - Lista de transações a serem avaliadas.
 * @returns Um objeto com o total de `expense` (despesas) e `income` (receitas).
 *
 * @example
 * const result = calculateExpenseIncome(transactions);
 */
export function calculateExpenseIncome(transactions: Transaction[]): TotalExpenseIncome {
    let totalExpense = 0;
    let totalIncome = 0;

    for (const transaction of transactions) {
        if (transaction.type !== 'transfer' && transaction.type !== 'adjustment') {
            if (transaction.amount < 0) {
                totalExpense += transaction.amount;
            } else {
                totalIncome += transaction.amount;
            }
        }
    }

    return { expense: totalExpense, income: totalIncome };
}
