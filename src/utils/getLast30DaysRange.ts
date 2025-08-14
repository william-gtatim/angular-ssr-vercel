export function getLast30DaysRange(): [Date, Date] {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // zera o horário

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29); // 29 dias atrás, incluindo hoje no total de 30

    return [startDate, today];
}
  