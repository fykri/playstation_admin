import { create } from 'zustand';
import { toaster } from '@/components/ui/toaster';
import { getRevenue, getRevenueStation } from '@/api/report';
import { setDate } from '@/utils/formatDate';
export const useReportStore = create((set, get) => ({
    itemsRevenue: {},
    itemsStationRevenue: [],
    loadingRevenueItems: false,
    handleRevenueItems: async (selectedPeriod, startDate, endDate) => {
        try {
            const result = await getRevenue(selectedPeriod, setDate(startDate[0]), setDate(endDate[0]));
            set({ itemsRevenue: result?.data });
        } catch (error) {
            toaster.dismiss();
            toaster.create({
                title: error.message,
                type: error,
            });
        }
    },
    handleRevenueStation: async (selectedPeriod, startDate, endDate) => {
        try {
            const result = await getRevenueStation(selectedPeriod, setDate(startDate[0]), setDate(endDate[0]));
            set({ itemsStationRevenue: result?.data });
        } catch (error) {
            toaster.dismiss();
            toaster.create({
                title: error.message,
                type: error,
            });
        }
    },
}));
