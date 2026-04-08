import { VStack } from '@chakra-ui/react';
import CardHeadStation from './cardHeadStation';
import CardBodyStationEmpty from './CardBodyStationEmpty';
import CardBodyStationUsed from './CardBodyStationUsed';
const CardStation = ({ status = 'kosong' }) => {
    return (
        <VStack w={'52'} h={'60'} rounded={'sm'} bg={'var(--color-container)'} boxShadow={'md'}>
            {/* Header */}
            <CardHeadStation status={status} />
            {/* EndHeader */}
            {/* Body */}
            {status === 'kosong' ? <CardBodyStationEmpty /> : <CardBodyStationUsed />}
            {/* End Body */}
        </VStack>
    );
};

export default CardStation;
