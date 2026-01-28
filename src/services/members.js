import api from './api';

// Mock data for development until backend endpoints are ready
const MOCK_MEMBERS = [
    {
        id: 8821,
        name: "Alex Johnson",
        tier: "ELITE",
        role: "Forward",
        joinDate: "Oct 2023",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
        isVerified: true
    },
    {
        id: 7742,
        name: "Marcus Reid",
        tier: "PRO",
        role: "Midfielder",
        joinDate: "Nov 2023",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
        isVerified: true
    },
    {
        id: 9931,
        name: "David Chen",
        tier: "STANDARD",
        role: "Goalie",
        joinDate: "Dec 2023",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80",
        isVerified: false
    },
    {
        id: 1123,
        name: "Sarah Williams",
        tier: "ELITE",
        role: "Coach",
        joinDate: "Jan 2024",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        isVerified: true
    },
    {
        id: 5543,
        name: "James Wilson",
        tier: "PRO",
        role: "Defender",
        joinDate: "Jan 2024",
        status: "Inactive",
        avatar: "https://images.unsplash.com/photo-1542206395-9f50a4793d86?w=150&q=80",
        isVerified: false
    },
    {
        id: 3321,
        name: "Michael Brown",
        tier: "STANDARD",
        role: "Forward",
        joinDate: "Feb 2024",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a3694c2dd77?w=150&q=80",
        isVerified: false
    }
];

export const getMembers = async () => {
    try {
        // Uncomment when backend is ready:
        // const response = await api.get('/members');
        // return response.data.members || [];

        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_MEMBERS), 500);
        });
    } catch (error) {
        console.error('Error fetching members:', error);
        return [];
    }
};

export const updateMemberStatus = async (id, status) => {
    try {
        // await api.patch(`/members/${id}`, { status });
        console.log(`Updated member ${id} status to ${status}`);
        return true;
    } catch (error) {
        console.error('Error updating member status:', error);
        return false;
    }
};
