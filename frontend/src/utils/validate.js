export function validateData(data) {
    for (const [key, value] of Object.entries(data)) {
        const isEmptyString = typeof value === 'string' && value.trim() === '';

        if (isEmptyString || value === null || value === undefined) {
            throw new Error(`data harus lengkap`);
        }
    }

    return true;
}
