import { Tabs } from '@chakra-ui/react';
import RenderStationCards from './card/RenderCardStation';
const TabsStation = ({ statusStation, onEdit, onDelete }) => {
    const filterByPackage = (items, packageName) => {
        if (packageName === 'all') return items;

        return items.filter(item => item.package?.toLowerCase() === packageName);
    };
    return (
        <Tabs.Root defaultValue="all" mt={2}>
            <Tabs.List>
                <Tabs.Trigger value="all">Semua</Tabs.Trigger>
                <Tabs.Trigger value="reguler">Reguler</Tabs.Trigger>
                <Tabs.Trigger value="vip">VIP</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="all">
                <RenderStationCards items={statusStation} onDelete={onDelete} onEdit={onEdit} />
            </Tabs.Content>

            <Tabs.Content value="reguler">
                <RenderStationCards
                    items={filterByPackage(statusStation, 'reguler')}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            </Tabs.Content>

            <Tabs.Content value="vip">
                <RenderStationCards items={filterByPackage(statusStation, 'vip')} onDelete={onDelete} onEdit={onEdit} />
            </Tabs.Content>
        </Tabs.Root>
    );
};

export default TabsStation;
