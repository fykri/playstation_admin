import { Dialog, Button, Alert, HStack } from '@chakra-ui/react';
const DialogFooter = ({ cancelTitle, saveTitle, onClick, loading, colorPalette = 'teal', alert }) => {
    return (
        <Dialog.Footer justifyContent={alert ? 'space-between': 'end'}>
            {alert && (
                <Alert.Root status="error" title="This is the alert title" w={'md'} >
                    <Alert.Indicator />
                    <Alert.Title>{alert}</Alert.Title>
                </Alert.Root>
            )}
            <HStack gap={3}>
                <Dialog.ActionTrigger asChild>
                    <Button variant="outline">{cancelTitle}</Button>
                </Dialog.ActionTrigger>
                <Button colorPalette={colorPalette} onClick={onClick} loading={loading} disabled={alert}>
                    {saveTitle}
                </Button>
            </HStack>
        </Dialog.Footer>
    );
};

export default DialogFooter;
