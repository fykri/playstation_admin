import { useRef, useEffect } from "react";

const useEnterNavigation = (totalFields, onSubmit, isOpen = true) => {
    const inputRefs = useRef([]);
    const isSubmittingRef = useRef(false);

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => {
                inputRefs.current[0]?.focus();
            });
        } else {
            inputRefs.current = [];
        }
    }, [isOpen]);

    const handleKeyDown = (index) => (e) => {
        if (!isOpen) return;

        if (e.key === "Enter") {
            e.preventDefault();

            if (index < totalFields - 1) {
                inputRefs.current[index + 1]?.focus();
            } else {
                if (isSubmittingRef.current) return;

                isSubmittingRef.current = true;
                onSubmit && onSubmit();

                setTimeout(() => {
                    isSubmittingRef.current = false;
                }, 500);
            }
        }
    };

    const setRef = (index) => (el) => {
        inputRefs.current[index] = el;
    };

    return {
        setRef,
        handleKeyDown,
    };
};

export default useEnterNavigation;
