import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import EventInput from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Box, Button, Input, Flex, IconButton, Select, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Holidays from 'date-holidays';
import axios from 'axios';
import { sql } from '@vercel/postgres';
const Calendar: React.FC = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [newEventTitle, setNewEventTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  useEffect(() => {
    onOpen(); // Open the login modal on component mount
  }, [onOpen]);

  const handleLogin = async (username: string, password: string) => {
    const url = `https://localhost:3000/api/users/login?username=${username}&password=${password}`;

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        setUserId(response.data.userId);
        setLoggedIn(true);
        fetchUserBookings(response.data.userId);
        onClose();
      } else {
        alert('Invalid login details');
      }
    } catch (error) {
      alert('Error logging in');
    }
  };

  const fetchUserBookings = async (userId: number) => {
    try {
      const url = `localhost:3000/api/bookings/get-user-bookings?userId=${userId}`;
      const response = await axios.get(url);
      if (response.status === 200) {
        setEvents(response.data.bookings);
      } else {
        alert('Error fetching bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const addNewEvent = async () => {
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

    const url = `localhost:3000/api/bookings/create-booking?userId=${userId}&title=${newEventTitle}&startDate=${startDate}&endDate=${endDate}&type=${eventType}`;

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        setEvents(response.data.bookings);
      } else {
        alert('Error adding event');
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }

    setNewEventTitle('');
    setStartDate('');
    setEndDate('');
    setEventType('');
    setShowInputs(false); // Hide inputs after adding the event
  };

  return (
    <Box>
      {!loggedIn ? (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Login</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Username"
                defaultValue="testuser"
                mb={3}
                id="username"
              />
              <Input
                placeholder="Password"
                type="password"
                defaultValue="testpassword"
                mb={3}
                id="password"
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="teal" onClick={() => {
                const username = (document.getElementById('username') as HTMLInputElement).value;
                const password = (document.getElementById('password') as HTMLInputElement).value;
                handleLogin(username, password);
              }}>
                Login
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        <>
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
        </>
      )}
    </Box>
  );
};

export default Calendar;