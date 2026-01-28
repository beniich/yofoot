import api from './api';

const MOCK_EVENTS = [
    {
        id: '1',
        title: 'FC Lions vs. Tigers',
        category: 'MATCH',
        date: '2024-10-12',
        time: '19:00',
        venue: 'Main Stadium',
        attendees: 1250,
        capacity: 2000,
        price: 45,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
        stats: {
            interested: 3400,
            going: 1250
        }
    },
    {
        id: '2',
        title: 'Youth Tournament Finals',
        category: 'TOURNAMENT',
        date: '2024-10-15',
        time: '09:00',
        venue: 'Training Complex',
        attendees: 450,
        capacity: 1000,
        price: 15,
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80',
        stats: {
            interested: 800,
            going: 450
        }
    },
    {
        id: '3',
        title: 'Open Training Session',
        category: 'TRAINING',
        date: '2024-10-18',
        time: '16:00',
        venue: 'Field B',
        attendees: 120,
        capacity: 200,
        price: 0,
        image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=800&q=80',
        stats: {
            interested: 300,
            going: 120
        }
    },
    {
        id: '4',
        title: 'Season End Gala',
        category: 'SOCIAL',
        date: '2024-11-01',
        time: '20:00',
        venue: 'Grand Hotel Ballroom',
        attendees: 280,
        capacity: 300,
        price: 120,
        image: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?w=800&q=80',
        stats: {
            interested: 500,
            going: 280
        }
    }
];

export const getEvents = async () => {
    try {
        // const response = await api.get('/events');
        // return response.data.events || [];
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_EVENTS), 600);
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
};

export const getEventStats = async () => {
    return {
        total: 12,
        attendees: 2450,
        free: 4
    };
};
