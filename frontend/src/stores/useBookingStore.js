import { getBookingTableActive } from '@/api/booking';
import { create } from 'zustand';

export const useBookingStore = create((set, get) => ({
    bookingItems: [],
    loadingBooking: false,
    fetchDataBooking: async () => {
        set({ loadingBooking: true });
        try {
            const result = await getBookingTableActive();
            set({
                bookingItems: [...result.data],
                //bookingItems: result.data.map((val)=> {
                //    return {
                //        ...val,
                //        isPlay: true
                //    }
                //})
            });
        } catch (error) {
            console.log(error);
        } finally {
            set({ loadingBooking: false });
        }
    },
}));
