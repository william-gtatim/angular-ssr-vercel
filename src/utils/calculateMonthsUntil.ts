/**
 * Calcula quantos meses faltam entre a data atual e a data final.
 *
 * @param targetDateStr Data alvo no formato "YYYY-MM-DD"
 * @returns Número de meses inteiros faltando. Se já passou, retorna 0.
 */
export function calculateMonthsUntil(targetDateStr: string): number {
    const today = new Date();
    const targetParts = targetDateStr.split('-').map(Number);

    // targetDate com hora zerada e sem influência do fuso local
    const targetDate = new Date(targetParts[0], targetParts[1] - 1, targetParts[2], 0, 0, 0);


    const yearDiff = targetDate.getFullYear() - today.getFullYear();
    const monthDiff = targetDate.getMonth() - today.getMonth();

    let totalMonths = yearDiff * 12 + monthDiff;

    // Se o dia do mês atual for maior que o da data alvo, desconta um mês
    if (targetDate.getDate() < today.getDate()) {
        totalMonths -= 1;
    }

    return Math.max(0, totalMonths);
}
