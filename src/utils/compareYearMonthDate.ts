export function comparaYearMonth(date1: string, date2: string){
    const date1Array = date1.split('-');
    const date2Array = date2.split('-');

    if (date1Array[0] == date2Array[0] && date1Array[1] == date2Array[1]) {
        return true;
    }

    return false;
}