/**
 * Verifica se duas datas estão no mesmo mês e ano.
 *
 * Esta função compara apenas o ano e o mês das datas fornecidas, ignorando o dia.
 * É útil para agrupar ou filtrar transações e eventos que ocorrem no mesmo período mensal.
 *
 * @param date1 - A primeira data a ser comparada, no formato "YYYY-MM-DD".
 * @param date2 - A segunda data a ser comparada, no formato "YYYY-MM-DD".
 * @returns `true` se as datas correspondem ao mesmo ano e mês; `false` caso contrário.
 *
 * @example
 * // Retorna true, pois ambas as datas são de janeiro de 2023
 * const result1 = isSameMonth("2023-01-15", "2023-01-28");
 * console.log(result1); // Saída: true
 *
 * @example
 * // Retorna false, pois os meses são diferentes
 * const result2 = isSameMonth("2023-01-15", "2023-02-01");
 * console.log(result2); // Saída: false
 *
 * @example
 * // Retorna false, pois os anos são diferentes
 * const result3 = isSameMonth("2023-01-15", "2024-01-15");
 * console.log(result3); // Saída: false
 */
export function isSameMonth(date1: string, date2: string): boolean {
    const date1Array = date1.split('-');
    const date2Array = date2.split('-');

    // Compara o ano (índice 0) e o mês (índice 1)
    if (date1Array[0] === date2Array[0] && date1Array[1] === date2Array[1]) {
        return true;
    }

    return false;
}