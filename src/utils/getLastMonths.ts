export function getLastMonths(dateStr: string, totalMeses: number): string[] {
    const [year, month]: [number, number] = dateStr.split('-').map(Number) as [number, number];
    const date: Date = new Date(year, month - 1);

    const meses: string[] = [];

    for (let i = 1; i <= totalMeses; i++) {
        const d = new Date(date);
        d.setMonth(d.getMonth() - i);
        const y: number = d.getFullYear();
        const m: string = String(d.getMonth() + 1).padStart(2, '0');
        meses.push(`${y}-${m}`);
    }

    return meses;
}
  