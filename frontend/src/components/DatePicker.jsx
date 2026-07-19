import { DatePicker, Portal } from '@chakra-ui/react';
import { LuCalendar } from 'react-icons/lu';

const DatePickerUi = ({ value, onChange, label, year, formatYear, parseYear}) => {
    return (
        <DatePicker.Root
            format={formatYear}
            parse={parseYear}
            value={value}
            onValueChange={onChange}
            defaultView={year}
            minView={year}
        >
            {label && <DatePicker.Label>{label}</DatePicker.Label>}
            <DatePicker.Control>
                <DatePicker.Input />
                <DatePicker.IndicatorGroup>
                    <DatePicker.Trigger>
                        <LuCalendar />
                    </DatePicker.Trigger>
                </DatePicker.IndicatorGroup>
            </DatePicker.Control>
            <Portal>
                <DatePicker.Positioner>
                    <DatePicker.Content>
                        <DatePicker.View view="day">
                            <DatePicker.Header />
                            <DatePicker.DayTable />
                        </DatePicker.View>
                        <DatePicker.View view="month">
                            <DatePicker.Header />
                            <DatePicker.MonthTable />
                        </DatePicker.View>
                        <DatePicker.View view="year">
                            <DatePicker.Header />
                            <DatePicker.YearTable />
                        </DatePicker.View>
                    </DatePicker.Content>
                </DatePicker.Positioner>
            </Portal>
        </DatePicker.Root>
    );
};

export default DatePickerUi;
