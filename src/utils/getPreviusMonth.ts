/**
 * Retorna uma string representando a mesma data no mês anterior,
 * ajustando o dia se o mês anterior tiver menos dias.
 *
 * A entrada deve estar no formato `'YYYY-MM-DD'`.
 *
 * @param dateString - Data no formato `'YYYY-MM-DD'`.
 * @returns Uma string no formato `'YYYY-MM-DD'`, representando o mês anterior com dia ajustado se necessário.
 *
 * @example
 * getPreviousMonth("2025-03-31"); // "2025-02-28"
 * getPreviousMonth("2025-01-31"); // "2024-12-31"
 */
export function getPreviousMonth(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);

    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;

    // Último dia do mês anterior
    const lastDayOfNewMonth = new Date(newYear, newMonth, 0).getDate();
    const adjustedDay = Math.min(day, lastDayOfNewMonth);

    const formattedMonth = String(newMonth).padStart(2, '0');
    const formattedDay = String(adjustedDay).padStart(2, '0');

    return `${newYear}-${formattedMonth}-${formattedDay}`;
}
  