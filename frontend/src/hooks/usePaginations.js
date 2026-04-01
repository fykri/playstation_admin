import { useState, useMemo } from "react";

const usePagination = (data = [], pageSize = 5) => {
    const [page, setPage] = useState(1);

    const currentData = useMemo(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return data.slice(start, end);
    }, [data, page, pageSize]);

    const resetPage = () => setPage(1);

    const safePage = useMemo(() => {
        const maxPage = Math.ceil(data.length / pageSize) || 1;
        return page > maxPage ? maxPage : page;
    }, [data.length, page, pageSize]);

    return {
        page: safePage,
        setPage,
        currentData,
        pageSize,
        count: data.length,
        resetPage,
    };
};

export default usePagination;
