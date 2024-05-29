import React, { useState, useEffect } from 'react';
import FullCalendar, { EventInput } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box, Button, Input, Flex, IconButton, Select } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Holidays from 'date-holidays';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [showInputs, setShowInputs] = useState<boolean>(false);

  useEffect(() => {
    const fetchHolidays = () => {
      const hd = new Holidays('CA');
      const holidays = hd.getHolidays(new Date().getFullYear());
      const holidayEvents = holidays.map((holiday) => ({
        id: holiday.date, // Use date as unique ID to prevent duplicates
        title: holiday.name,
        start: holiday.date,
        allDay: true,
        color: 'purple', // Set color for holidays
      }));
      setEvents((prevEvents) => {
        // Filter out existing holiday events to avoid duplicates
        const nonHolidayEvents = prevEvents.filter(event => !event.id || !holidayEvents.find(holiday => holiday.id === event.id));
        return [...nonHolidayEvents, ...holidayEvents];
      });
    };

    fetchHolidays();
  }, []);

  const addNewEvent = () => {
    const today = new Date().toISOString().split('T')[0];
    if (newEventTitle.trim() === '') {
      alert('Event title cannot be empty');
      return;
    }
    if (startDate < today) {
      alert('Start date cannot be earlier than today');
      return;
    }
    if (endDate < startDate) {
      alert('End date cannot be before start date');
      return;
    }
    if (eventType === '') {
      alert('Please select an event type');
      return;
    }

    const newEvent = {
      title: newEventTitle,
      start: startDate,
      end: endDate,
      allDay: true,
      extendedProps: {
        type: eventType,
      },
      color: eventType === 'reservation' ? 'gray' : eventType === 'checkout' ? 'green' : '',
    };

    setEvents([...events, newEvent]);
    setNewEventTitle('');
    setStartDate('');
    setEndDate('');
    setEventType('');
    setShowInputs(false); // Hide inputs after adding the event
  };

  return (
    <Box>
      <Flex mb={4} alignItems="center">
        <IconButton
          icon={<AddIcon />}
          aria-label="Add event"
          onClick={() => setShowInputs(!showInputs)}
          borderRadius="50%"
          size="lg"
          colorScheme="teal"
          mr={2}
        />
        {showInputs && (
          <>
            <Input
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              placeholder="Enter event title"
              width="200px"
              mr={2}
            />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start date"
              width="150px"
              mr={2}
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End date"
              width="150px"
              mr={2}
            />
            <Select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="Select event type"
              width="150px"
              mr={2}
            >
              <option value="reservation">Reservation</option>
              <option value="checkout">Checkout</option>
            </Select>
            <Button onClick={addNewEvent} colorScheme="teal">
              Add Event
            </Button>
          </>
        )}
      </Flex>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events}
      />
    </Box>
  );
};

export default Calendar;
