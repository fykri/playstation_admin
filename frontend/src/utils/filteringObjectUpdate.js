const filteringObject = (oldData, newData) => {
    const changed = {};
    for (const key in newData) {
        const oldVal = oldData[key] ?? '';
        const newVal = newData[key] ?? '';

        if (oldVal !== newVal) {
            changed[key] = newData[key];
        }
    }
    return changed
};

export default filteringObject;
