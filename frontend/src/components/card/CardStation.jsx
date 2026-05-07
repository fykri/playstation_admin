import { VStack, HStack } from '@chakra-ui/react';
import CardHeadStation from './cardHeadStation';
import CardBodyStationEmpty from './CardBodyStationEmpty';
import CardBodyStationUsed from './CardBodyStationUsed';
import { IconButton } from '@chakra-ui/react';
import { MdDelete, MdEditSquare } from 'react-icons/md';
const CardStation = ({
    status = 'kosong',
    nameStation,
    nameConsole,
    namePackage,
    price,
    onClickDelete,
    onClickEdit,
}) => {
    return (
        <VStack w={'52'} h={'60'} rounded={'sm'} bg={'var(--color-container)'} boxShadow={'md'} position={'relative'}>
            <HStack position={'absolute'} w={'full'} justifyContent={'space-between'} top={12}>
                <IconButton
                    size={'xs'}
                    aria-label="edit"
                    bg={'blue.600'}
                    _hover={{
                        bg: 'blue.700',
                    }}
                    onClick={onClickEdit}
                    zIndex={999}
                    color={'white'}
                >
                    <MdEditSquare></MdEditSquare>
                </IconButton>
                <IconButton
                    size={'xs'}
                    aria-label="delete"
                    bg={'red.600'}
                    _hover={{
                        bg: 'red.700',
                    }}
                    onClick={onClickDelete}
                    zIndex={999}
                    color={'white'}
                >
                    <MdDelete></MdDelete>
                </IconButton>
            </HStack>
            {/* Header */}
            <CardHeadStation
                status={status}
                nameConsole={nameConsole}
                nameStation={nameStation}
                namePackage={namePackage}
            />
            {/* EndHeader */}
            {/* Body */}
            {status === 'kosong' ? <CardBodyStationEmpty price={price} /> : <CardBodyStationUsed price={price} />}
            {/* End Body */}
        </VStack>
    );
};

export default CardStation;
