export const formatRupiah = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
};

export const filteringNumber = (value) => {
    return value.replace(/\D/g, "");
};