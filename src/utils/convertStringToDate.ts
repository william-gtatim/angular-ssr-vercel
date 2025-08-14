export function convertStringToDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00`);
}
