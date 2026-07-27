import { create } from 'zustand';
import { startbilling, getAllStation } from '@/api/station';
import { toaster } from '@/components/ui/toaster';
export const useBillingStore = create((set, get) => ({
    stationItems: [],
    loadingStoreStation: false,
    fetchStation: async () => {
        try {
            const result = await getAllStation();
            set({
                stationItems: result.map(val => {
                    return {
                        ...val,
                        new_price: val.hourly_price,
                    };
                }),
            });
        } catch (error) {
            console.log(error.message);
        }
    },
    setStation: val => {
        set({
            stationItems: val,
        });
    },
    setBilling: async (id, val) => {
        set(state => ({
            stationItems: state.stationItems.map(item => {
                if (item.id_station === id) {
                    return {
                        ...item,
                        billing: val,
                        new_price: item.hourly_price * val,
                    };
                }
                return item;
            }),
        }));
    },
    startStation: async (id, time) => {
        set({
            loadingStoreStation: true,
        });
        try {
            await startbilling(id, time);
            await get().fetchStation();
            toaster.dismiss();
            toaster.create({
                type: 'success',
                title: 'START GAME',
            });
        } catch (error) {
            toaster.create({
                title: error.message,
                type: 'error',
            });
        } finally {
            set({
                loadingStoreStation: false,
            });
        }
    },
}));
