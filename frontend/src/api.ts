// API Endpoints & Configuration
import { httpClient } from './client';
import { ODDStore } from './store';
import { User, Property, Room, Booking, Review } from './data';

export const api = {
  // Auth API
  auth: {
    login: async (username: string, password?: string) => {
      return ODDStore.login(username, password);
    },
    register: async (newUser: Partial<User>) => {
      return ODDStore.register(newUser);
    },
    logout: async () => {
      ODDStore.logout();
      return { success: true };
    },
    getCurrentUser: () => ODDStore.getCurrentUser(),
  },

  // Properties & Rooms API
  properties: {
    list: async (criteria: any) => {
      return ODDStore.search(criteria);
    },
    getById: async (id: number | string) => {
      return ODDStore.getProperty(id);
    },
    getRooms: async (propertyId: number | string) => {
      return ODDStore.getRoomsByProperty(propertyId);
    },
    getHostProperties: async (owner: string) => {
      return ODDStore.getHostProperties(owner);
    },
    create: async (payload: Partial<Property>) => {
      return ODDStore.addProperty(payload);
    },
    delete: async (id: number) => {
      return ODDStore.deleteProperty(id);
    },
  },

  // Bookings API
  bookings: {
    calculateQuote: (roomId: number | string, checkIn?: string, checkOut?: string, guests?: number | string) => {
      return ODDStore.calculateQuote(roomId, checkIn, checkOut, guests);
    },
    create: async (payload: any) => {
      return ODDStore.createBooking(payload);
    },
    getMyBookings: async (username: string) => {
      return ODDStore.getMyBookings(username);
    },
    getByCode: async (code: string) => {
      return ODDStore.getBooking(code);
    },
    cancel: async (code: string) => {
      return ODDStore.cancelBooking(code);
    },
    updateStatus: async (code: string, status: Booking['status']) => {
      return ODDStore.updateBookingStatus(code, status);
    },
    getAll: async () => {
      return ODDStore.getAllBookings();
    },
  },

  // Reviews API
  reviews: {
    submit: async (payload: any) => {
      return ODDStore.submitReview(payload);
    },
    getByProperty: async (propertyId: number | string) => {
      return ODDStore.getReviewsByProperty(propertyId);
    },
  },

  // Host & Admin Operations API
  host: {
    getRevenue: async (owner: string) => {
      return ODDStore.getRevenueData(owner);
    },
    addRoom: async (payload: Partial<Room>) => {
      return ODDStore.addRoom(payload);
    },
    deleteRoom: async (id: number) => {
      return ODDStore.deleteRoom(id);
    },
    getRoomBlocks: async (roomId?: number | string) => {
      return ODDStore.getRoomBlocks(roomId);
    },
    addRoomBlock: async (payload: any) => {
      return ODDStore.addRoomBlock(payload);
    },
    deleteRoomBlock: async (id: number) => {
      return ODDStore.deleteRoomBlock(id);
    },
  },

  admin: {
    getUsers: async () => {
      return ODDStore.getAllUsers();
    },
    addUser: async (payload: Partial<User>) => {
      return ODDStore.addUser(payload);
    },
    toggleStatus: async (userId: number | string) => {
      return ODDStore.toggleUserStatus(userId);
    },
    changeRole: async (userId: number | string, newRole: User['role']) => {
      return ODDStore.changeUserRole(userId, newRole);
    },
  },
};

export default api;
