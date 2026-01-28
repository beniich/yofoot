# 🔌 Backend Connection Guide

## Overview
We have implemented a Service Layer pattern to decouple the React frontend from the data source. This allows for:
1.  **Development without Backend**: Using mock data (current state).
2.  **Easy Integration**: Switching to real API calls by modifying service files.
3.  **Centralized Logic**: Managing API endpoints in one place.

## Service Architecture

The services are located in `src/services/` and follow this structure:

```javascript
// src/services/members.js
import api from './api'; // Axios instance

export const getMembers = async () => {
    // 1. Mock Data Implementation (Current)
    // return new Promise(resolve => setTimeout(() => resolve(MOCK_DATA), 500));

    // 2. Real API Implementation (Uncomment to activate)
    const response = await api.get('/members');
    return response.data;
};
```

## Available Services

| Service File | Purpose | Key Functions |
| :--- | :--- | :--- |
| `members.js` | Manage club members | `getMembers()`, `updateMemberStatus()` |
| `events.js` | Event listing & stats | `getEvents()`, `getEventStats()` |
| `tickets.js` | User tickets & validation | `getTickets()`, `validateTicket()` |
| `shop.js` | Products & Cart | `getProducts()`, `createOrder()` |

## How to Connect to Real Backend

To connect the frontend to a real Node.js/Express backend:

1.  **Ensure Backend Routes Exist**:
    Make sure your backend (`server/`) has the corresponding routes:
    - `GET /api/members`
    - `GET /api/events`
    - `GET /api/tickets`
    - `GET /api/products`
    - `POST /api/orders`

2.  **Update Service Files**:
    Open each service file in `src/services/` and uncomment the API calls while removing/commenting out the mock data return.

    **Example (`src/services/events.js`):**
    ```javascript
    export const getEvents = async () => {
        try {
            // Uncomment this:
            const response = await api.get('/events');
            return response.data;

            // Remove/Comment this:
            // return new Promise((resolve) => { ... });
        } catch (error) { ... }
    };
    ```

3.  **Configure API URL**:
    Ensure `src/services/api.js` points to your running backend.
    ```javascript
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    ```

## Data Types Reference

When building your backend, ensure the JSON response matches these expected shapes:

**Member Object:**
```json
{
  "id": "1",
  "name": "John Doe",
  "tier": "ELITE", // ELITE, PRO, STANDARD
  "role": "Forward",
  "status": "Active", // Active, Inactive
  "avatar": "url...",
  "isVerified": true
}
```

**Event Object:**
```json
{
  "id": "1",
  "title": "Match Name",
  "category": "MATCH", // MATCH, TOURNAMENT, TRAINING, SOCIAL
  "date": "2024-10-12",
  "time": "19:00",
  "venue": "Stadium",
  "attendees": 100,
  "capacity": 200,
  "price": 45,
  "image": "url..."
}
```
