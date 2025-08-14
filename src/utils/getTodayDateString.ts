export function getTodayDateString(): string {
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentYear = today.getFullYear();
    const day = String(today.getDate()).padStart(2, '0');
    return `${currentYear}-${currentMonth}-${day}`;
}
