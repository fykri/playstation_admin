export const formatDateTime = (date) => {
    const d = new Date(date);

    const time = d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('id-ID', { month: 'short' });
    const year = d.getFullYear();

    return `${time} , ${day} ${month} ${year}`;
};