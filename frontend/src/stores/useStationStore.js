import { create } from 'zustand';

export const useBillingStore = create(set => ({
    stationItems: [],
    setStation: val => {
        set({
            stationItems: val,
        });
    },
    setBilling: (id, val) => {
        set(state => ({
            stationItems: state.stationItems.map(item => {
                if (item.id_station === id) {
                    return {
                        ...item,
                        billing: val,
                        new_price: item.hourly_price * val
                    };
                }
                return item;
            }),
        }));
    },
}));
