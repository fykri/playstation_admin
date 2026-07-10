export const setDate = date => {
    return `${String(date?.year)}-${String(date?.month).padStart(2, '0')}-${String(date?.day).padStart(2, '0')}`;
};

export const getDateByTimestamp = date => {
    return date.split('T')[0];
};
