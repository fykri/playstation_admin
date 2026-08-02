import { HStack, Box, Stat } from '@chakra-ui/react';
import { formatRupiah } from '@/utils/formatNumber';
const renderGrowth = growthValue => {
    if (growthValue === null || growthValue === undefined) {
        return (
            <Stat.HelpText color="gray.400" mb={0}>
                -
            </Stat.HelpText>
        );
    }
    const isPositive = growthValue >= 0;
    return (
        <Stat.HelpText color={isPositive ? 'green.500' : 'red.500'} fontWeight="semibold" mb={0}>
            {isPositive ? `+${growthValue}%` : `${growthValue}%`} vs bln lalu
        </Stat.HelpText>
    );
};

const RevenueReportComponent = ({ data = {} }) => {
    const cardItems = [
        {
            id: 1,
            label: 'Total Pendapatan',
            value: `Rp. ${formatRupiah(data?.total_pendapatan || '0')}` ,
            growth: data.pendapatan_growth,
            color: 'blue.500',
        },
        {
            id: 2,
            label: 'Total Durasi',
            value: `${data?.total_durasi} Jam`,
            growth: data.durasi_growth,
            color: 'purple.500',
        },
        {
            id: 3,
            label: 'Total Sesi',
            value: `${data.total_session} Sesi`,
            growth: data.session_growth,
            color: 'orange.500',
        },
        {
            id: 4,
            label: 'rata rata pendapatan',
            value: `Rp. ${formatRupiah(data.rata_rata_session)}`,
            growth: null,
            customSubtext: 'session',
        },
    ];
    return (
        <HStack
            gap={3}
            justifyContent={'center'}
            flexWrap={'wrap'}
            md={{ justifyContent: 'space-evenly', flexWrap: 'wrap' }}
        >
            {Object.keys(data).length > 0
                ? cardItems.map(card => (
                      <Box
                          bg={'var(--color-card)'}
                          minW={'36'}
                          h={'20'}
                          rounded={'sm'}
                          py={1}
                          px={2}
                          lg={{ w: '32' }}
                          key={card.id}
                      >
                          <Stat.Root gap={0}>
                              <Stat.Label color="gray.500" fontSize="xs" fontWeight="medium">
                                  {card.label}
                              </Stat.Label>
                              <Stat.ValueText fontSize="md" fontWeight="bold" color="var(--color-secondary)" my={0.5}>
                                  {card.value}
                              </Stat.ValueText>
                              {card.customSubtext ? (
                                  <Stat.HelpText color="gray.500" mb={0}>
                                      {card.customSubtext}
                                  </Stat.HelpText>
                              ) : (
                                  renderGrowth(card.growth)
                              )}
                          </Stat.Root>
                      </Box>
                  ))
                : null}
        </HStack>
    );
};

export default RevenueReportComponent;
