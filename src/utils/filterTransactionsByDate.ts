import { Account, Transaction } from "../app/models";

// export type Account = {
//     id: number,
//     title: string,
//     default: boolean,
//     bank_logo: number,
//     type: 'credit' | 'debt',
//     closing_day: number | null
// }


/**
 * Retorna { start, end } do ciclo de fatura,
 * onde start é inclusivo e end é exclusivo.
 */
/**
 * Retorna o período de fatura **do mês de `refDate`**.
 * start é inclusivo; end é exclusivo.
 */
function getCreditBillingPeriod(
    closingDay: number,
    refDate: Date
): { start: Date; end: Date } {
    const year = refDate.getFullYear();
    const month = refDate.getMonth(); // 0 = janeiro

    // início: dia seguinte ao fechamento do mês anterior
    const start = new Date(year, month - 1, closingDay + 1, 0, 0, 0);
    // fim (exclusive): dia seguinte ao fechamento do próprio mês
    const end = new Date(year, month, closingDay + 1, 0, 0, 0);

    return { start, end };
}
  
/**
 * Filtra transações:
 * - débito: mês calendário [mês/1, próximo mês/1)
 * - crédito: ciclo de fatura [start, end)
 */
export function filterTransactionsByDate(
    transactions: Transaction[],
    refDate: Date,
    accounts: Account[] = []
): Transaction[] {
    const accMap = new Map(accounts.map(a => [a.id, a]));

    return transactions.filter(t => {
        const txDate = new Date(t.date + 'T00:00:00');
        const acc = accMap.get(t.account);

        if (!acc || acc.type === 'debt' || acc.closing_day == null) {
            // mês calendário, fim exclusivo
            const monthStart = new Date(refDate.getFullYear(), refDate.getMonth(), 1);
            const nextMonth = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 1);
            return txDate >= monthStart && txDate < nextMonth;
        }


        const { start, end } = getCreditBillingPeriod(acc.closing_day, refDate);
      
        return txDate >= start && txDate < end;
    });
}
  