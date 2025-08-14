import { Transaction } from "../app/models";
/**
 * Aggregates transaction amounts by category, with options to filter by transaction type.
 * 
 * @param transactions - Array of Transaction objects to process
 * @param typeFilter - Type of transactions to include:
 *                    'expense' = only negative amounts (default)
 *                    'income' = only positive amounts
 *                    'all' = all transactions regardless of type
 * @returns Map where keys are category IDs and values are aggregated amounts
 * 
 * @example
 * // Sum expenses by category
 * const expensesByCategory = aggregateTransactionsByCategory(transactions);
 * 
 * @example
 * // Sum incomes by category
 * const incomesByCategory = aggregateTransactionsByCategory(transactions, 'income');
 * 
 * @example
 * // Sum all transactions by category
 * const allByCategory = aggregateTransactionsByCategory(transactions, 'all');
 */
export function aggregateTransactionsByCategory(
    transactions: Transaction[],
    typeFilter: 'expense' | 'income' | 'all' = 'expense'
): Map<number, number> {
    return transactions.reduce((map, transaction) => {
        if (transaction.category !== null &&
            (typeFilter === 'all' || transaction.type === typeFilter)) {
            const amount = Math.abs(transaction.amount);
            map.set(transaction.category, (map.get(transaction.category) || 0) + amount);
        }
        return map;
    }, new Map<number, number>());
  }