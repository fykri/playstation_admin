import { ScrollArea } from "@chakra-ui/react";
const Scroll = ({ children, h = 'full' }) => (
    <ScrollArea.Root height={h} maxW="lg" variant={'always'}>
        <ScrollArea.Viewport>
            <ScrollArea.Content spaceY="4" textStyle="sm">
                {children}
            </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar>
            <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
    </ScrollArea.Root>
);

export default Scroll;
