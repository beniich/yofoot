import api from './api';

const MOCK_TICKETS = [
    {
        id: '1',
        eventId: '101',
        eventName: 'FC Lions vs. Tigers',
        date: '2024-10-12',
        time: '19:00',
        venue: 'Main Stadium',
        location: 'New York, USA',
        section: 'A',
        row: '12',
        seat: '45',
        ticketNumber: 'TKT-882190',
        type: 'VIP', // VIP, ELITE, STANDARD
        status: 'upcoming', // upcoming, past
        isValidated: false,
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80'
    },
    {
        id: '2',
        eventId: '102',
        eventName: 'Season Opener',
        date: '2024-10-25',
        time: '20:00',
        venue: 'City Arena',
        location: 'New York, USA',
        section: 'B',
        row: '5',
        seat: '22',
        ticketNumber: 'TKT-773211',
        type: 'STANDARD',
        status: 'upcoming',
        isValidated: false,
        image: 'https://images.unsplash.com/photo-1504124637617-13000d97706f?w=800&q=80'
    },
    {
        id: '3',
        eventId: '99',
        eventName: 'Charity Match',
        date: '2024-09-15',
        time: '14:00',
        venue: 'Community Field',
        location: 'Brooklyn, USA',
        section: 'GA',
        row: '-',
        seat: '-',
        ticketNumber: 'TKT-112233',
        type: 'ELITE',
        status: 'past',
        isValidated: true,
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bde9be2b?w=800&q=80'
    }
];

export const getTickets = async () => {
    try {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_TICKETS), 700));
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const validateTicket = async (ticketId) => {
    // console.log("Validating ticket", ticketId);
    return true;
};
