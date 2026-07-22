import { Box, HoverCard, Portal, Strong } from '@chakra-ui/react';
import { useState } from 'react';
const HoverCardComponent = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleTriggerClick = e => {
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

        if (isTouchDevice) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };
    return (
        <HoverCard.Root
            size="sm"
            positioning={{ placement: 'top' }}
            open={isOpen}
            onOpenChange={e => setIsOpen(e.open)}
        >
            <HoverCard.Trigger asChild onClick={handleTriggerClick}>
                {children}
            </HoverCard.Trigger>
            <Portal>
                <HoverCard.Positioner>
                    <HoverCard.Content maxWidth="240px">
                        <HoverCard.Arrow />
                        <Box>
                            <Strong>Informasi: </Strong> jika ingin tambah, selesaikan dan hapus billing, harap di menu station !
                        </Box>
                    </HoverCard.Content>
                </HoverCard.Positioner>
            </Portal>
        </HoverCard.Root>
    );
};

export default HoverCardComponent;
