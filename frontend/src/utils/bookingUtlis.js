export const statusColor = {
    playing: 'green',
    booking: 'orange',
    finish: 'blue',
    cancel: 'red',
    expired: 'yellow',
};

const statusBooking = [
    {
        status: 'booking',
        title: 'booking',
    },
    {
        status: 'playing',
        title: 'Bermain',
    },
    {
        status: 'finish',
        title: 'Selesai',
    },
    {
        status: 'cancel',
        title: 'Batal',
    },
    {
        status: 'cancel',
        title: 'Batal',
    },
    {
        status: 'expired',
        title: 'kadaluwarsa',
    },
];

export const getBookingStatus = (bookingDate, bookingStart, graceMinutes = 30) => {
    const bookingStartTime = new Date(`${bookingDate}T${bookingStart}`);

    const bookingExpiredTime = new Date(bookingStartTime.getTime() + graceMinutes * 60 * 1000);

    const now = new Date();

    return {
        canStart: now >= bookingStartTime && now <= bookingExpiredTime,

        expired: now > bookingExpiredTime,

        bookingStartTime,
        bookingExpiredTime,
    };
};

export const formatStatusToId = title => {
    const result = statusBooking.find(val => {
        return val.status === title;
    });
    return result.title;
};
