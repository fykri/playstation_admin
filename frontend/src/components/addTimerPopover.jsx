import { Popover, IconButton, Button, VStack, Portal, Box } from '@chakra-ui/react';
import { LuClock3 } from 'react-icons/lu';
import { useState } from 'react';
import BillingControl from './BillingControl';
import { Tooltip } from './ui/tooltip';

const AddTimePopover = ({ onAddTime }) => {
    const [billing, setBilling] = useState(1);
    const [open, setOpen] = useState(false);

    const handleAddTime = () => {
        onAddTime(billing);
        setOpen(false);
        setBilling(1);
    };

    return (
        <Popover.Root positioning={{ placement: 'bottom-start' }} open={open} onOpenChange={e => setOpen(e.open)}>
            <Popover.Trigger asChild>
                <Box>
                    <Tooltip content="tambah waktu" showArrow>
                        <IconButton size="xs" colorPalette="green">
                            <LuClock3 />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content w="200px">
                        <Popover.Arrow />
                        <Popover.Body>
                            <VStack>
                                <BillingControl billing={billing} onChange={e => setBilling(Number(e.value))} />
                            </VStack>
                        </Popover.Body>

                        <Popover.Footer>
                            <Button size="sm" colorPalette="green" width="full" onClick={handleAddTime}>
                                Tambah {billing} Jam
                            </Button>
                        </Popover.Footer>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};

export default AddTimePopover;
