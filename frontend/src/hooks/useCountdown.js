import { useEffect, useRef } from 'react';

if (!window.activeBillingIntervals) {
    window.activeBillingIntervals = {};
}

export const useCountdown = ({ id_station, endTime, status, onTimeUp }) => {
    const onTimeUpRef = useRef(onTimeUp);
    const hasCalledTimeUp = useRef(false);

    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);

    useEffect(() => {
        hasCalledTimeUp.current = false;
    }, [endTime]);

    useEffect(() => {
        const windowKey = id_station;

        const clearTimer = () => {
            if (window.activeBillingIntervals[windowKey]) {
                clearInterval(window.activeBillingIntervals[windowKey]);
                delete window.activeBillingIntervals[windowKey];
            }
        };

        // KONDISI SEKARANG JAUH LEBIH SEDERHANA:
        // Jika status bukan playing, atau endTime tidak ada, langsung matikan mesin.
        if (status !== 'playing' || !endTime) {
            clearTimer();
            return;
        }

        // Amankan sisa double-render kilat
        clearTimer();

        const intervalTick = () => {
            const diff = new Date(endTime).getTime() - Date.now();
            const textElement = document.getElementById(`timer-display-${id_station}`);

            if (diff <= 0) {
                if (textElement) textElement.innerText = '00:00:00';
                if (!hasCalledTimeUp.current && onTimeUpRef.current) {
                    hasCalledTimeUp.current = true;
                    onTimeUpRef.current();
                }
                clearTimer();
                return;
            }

            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

            if (textElement) {
                textElement.innerText = timeString;
            }
        };

        // Jalankan render awal secara instan
        setTimeout(intervalTick, 0);

        // Buat interval detikan baru
        window.activeBillingIntervals[windowKey] = setInterval(intervalTick, 1000);

        return () => {
            // Kontrol penuh diserahkan ke clearTimer di atas saat depedensi berubah
        };
    }, [endTime, status, id_station]);
};
