export function formateDate(timestamp: number) {
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 8); // 设置为 UTC+8 时区
    return date.toISOString().substring(0, 10);
}

export function formateDateTime(timestamp: number) {
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 8); // 设置为 UTC+8 时区
    return date.toISOString().substring(0, 16).replaceAll('T', ' ');
}