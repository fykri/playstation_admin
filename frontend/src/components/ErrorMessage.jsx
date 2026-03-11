import { Alert, CloseButton } from "@chakra-ui/react";
import { useState, useEffect } from "react";

const ErrorMessage = ({ message }) => {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        if (message) setIsOpen(true);
    }, [message]);

    if (!message || !isOpen) return null;

    return (
        <Alert.Root status="error" borderRadius="md" position="relative">
            <Alert.Indicator />
            <Alert.Content>
                <Alert.Title>Error</Alert.Title>
                <Alert.Description>{message}</Alert.Description>
            </Alert.Content>
            <CloseButton
                size="sm"
                position="absolute"
                top="8px"
                right="8px"
                onClick={() => setIsOpen(false)}
            />
        </Alert.Root>
    );
};

export default ErrorMessage;
