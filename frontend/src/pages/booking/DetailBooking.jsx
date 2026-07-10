import { Badge, Box, Card, Grid, Heading, Table, Text } from '@chakra-ui/react';
import { getBookingById } from '@/api/booking';
import { useEffect, useState } from 'react';
import { formatRupiah } from '@/utils/formatNumber';



export default function BookingDetail({id_booking}) {
    const [booking, setBooking] = useState([])

    const fetchBookingItems = async()=> {
        try {
            const result = await getBookingById(id_booking)
            setBooking(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=> {
        if(id_booking) {    
            fetchBookingItems()
        }
    }, [id_booking])
    return (
        <Box px={6}>
            <Text color="gray.500" mb={2}>Informasi lengkap booking pelanggan</Text>

            <Grid
                templateColumns={{
                    base: '1fr',
                    md: 'repeat(3,1fr)',
                }}
                gap={5}
                mb={6}
            >
                <Card.Root>
                    <Card.Body>
                        <Text color="gray.500">Status</Text>

                        <Badge mt={2} colorPalette="orange" width="fit-content">
                            Booking
                        </Badge>
                    </Card.Body>
                </Card.Root>

                <Card.Root>
                    <Card.Body>
                        <Text color="gray.500">Billing</Text>

                        <Heading size="lg">{booking.billing}</Heading>
                    </Card.Body>
                </Card.Root>

                <Card.Root>
                    <Card.Body>
                        <Text color="gray.500">Total Harga</Text>

                        <Heading size="lg" color="green.500">
                            {`Rp. ${formatRupiah(booking?.total_price)}`}
                        </Heading>
                    </Card.Body>
                </Card.Root>
            </Grid>
            <Card.Root>
                <Card.Header>
                    <Heading size="md">Informasi Booking</Heading>
                </Card.Header>

                <Card.Body>
                    <Table.Root variant="outline">
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell fontWeight="medium">ID Booking</Table.Cell>

                                <Table.Cell>{booking?.id_booking}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell fontWeight="medium">Customer</Table.Cell>

                                <Table.Cell>{booking?.customer_name}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell fontWeight="medium">No HP</Table.Cell>

                                <Table.Cell>{booking?.number_phone}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell fontWeight="medium">Station</Table.Cell>

                                <Table.Cell>{booking?.name_station}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell fontWeight="medium">Tanggal</Table.Cell>

                                <Table.Cell>{booking?.booking_date}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell fontWeight="medium">Jam</Table.Cell>

                                <Table.Cell>
                                    {String(booking?.booking_start).slice(0,5)} - {String(booking?.booking_end).slice(0,5)}
                                </Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell fontWeight="medium">Billing</Table.Cell>

                                <Table.Cell>{booking?.billing}</Table.Cell>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell fontWeight="medium">Total Harga</Table.Cell>

                                <Table.Cell color="green.500" fontWeight="bold">
                                    {`Rp. ${formatRupiah(booking?.total_price)}`}
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </Card.Body>
            </Card.Root>
        </Box>
    );
}
