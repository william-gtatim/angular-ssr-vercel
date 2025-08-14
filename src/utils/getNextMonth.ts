/**
 * Retorna uma string representando a mesma data no mês seguinte,
 * ajustando o dia se o próximo mês tiver menos dias.
 *
 * A entrada deve estar no formato `'YYYY-MM-DD'`.
 *
 * @param dateString - Data no formato `'YYYY-MM-DD'`.
 * @returns Uma string no formato `'YYYY-MM-DD'`, representando o mês seguinte com o dia ajustado se necessário.
 *
 * @example
 * getNextMonth("2025-01-31"); // "2025-02-28"
 * getNextMonth("2024-12-31"); // "2025-01-31"
 * getNextMonth("2025-06-15"); // "2025-07-15"
 */
export function getNextMonth(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);

    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;

    // Último dia do novo mês
    const lastDayOfNewMonth = new Date(newYear, newMonth, 0).getDate();
    const adjustedDay = Math.min(day, lastDayOfNewMonth);

    const formattedMonth = String(newMonth).padStart(2, '0');
    const formattedDay = String(adjustedDay).padStart(2, '0');

    return `${newYear}-${formattedMonth}-${formattedDay}`;
}
  