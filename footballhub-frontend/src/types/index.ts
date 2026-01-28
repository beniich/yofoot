// ==================== USER TYPES ====================

export enum UserRole {
    FAN = 'FAN',
    CLUB_ADMIN = 'CLUB_ADMIN',
    CLUB_MEMBER = 'CLUB_MEMBER',
    ORGANIZER = 'ORGANIZER',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

export interface User {
    id: string
    email: string
    firstName?: string
    lastName?: string
    phone?: string
    avatar?: string
    role: UserRole
    isVerified: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
}

// ==================== CLUB TYPES ====================

export enum SubscriptionPlan {
    BASIC = 'BASIC',
    PRO = 'PRO',
    ELITE = 'ELITE',
}

export enum ClubRole {
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    MEMBER = 'MEMBER',
}

export interface Club {
    id: string
    name: string
    slug: string
    description?: string
    logo?: string
    coverImage?: string
    email: string
    phone?: string
    website?: string
    address?: string
    city?: string
    country?: string
    subscriptionPlan: SubscriptionPlan
    subscriptionStatus: string
    subscriptionEndsAt?: string
    createdAt: string
    updatedAt: string
}

export interface ClubMember {
    id: string
    userId: string
    clubId: string
    role: ClubRole
    isActive: boolean
    joinedAt: string
    user?: User
    club?: Club
}

// ==================== EVENT TYPES ====================

export enum EventCategory {
    MATCH = 'MATCH',
    TOURNAMENT = 'TOURNAMENT',
    TRAINING = 'TRAINING',
    MEETING = 'MEETING',
    OTHER = 'OTHER',
}

export enum EventStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface Event {
    id: string
    clubId: string
    title: string
    description?: string
    coverImage?: string
    venue: string
    address?: string
    city: string
    country: string
    startDate: string
    endDate?: string
    category: EventCategory
    status: EventStatus
    maxAttendees?: number
    isPublic: boolean
    createdAt: string
    updatedAt: string
    club?: Club
}

// ==================== TICKET TYPES ====================

export enum TicketType {
    VIP = 'VIP',
    STANDARD = 'STANDARD',
    EARLY_BIRD = 'EARLY_BIRD',
    FREE = 'FREE',
}

export enum TicketStatus {
    VALID = 'VALID',
    USED = 'USED',
    CANCELLED = 'CANCELLED',
    EXPIRED = 'EXPIRED',
}

export interface Ticket {
    id: string
    eventId: string
    userId?: string
    ticketNumber: string
    qrCode: string
    ticketType: TicketType
    price: number
    currency: string
    status: TicketStatus
    isValidated: boolean
    validatedAt?: string
    validatedBy?: string
    createdAt: string
    updatedAt: string
    event?: Event
    user?: User
}

// ==================== SHOP TYPES ====================

export enum ProductCategory {
    TSHIRT = 'TSHIRT',
    JERSEY = 'JERSEY',
    ACCESSORIES = 'ACCESSORIES',
    EQUIPMENT = 'EQUIPMENT',
    OTHER = 'OTHER',
}

export interface Product {
    id: string
    clubId?: string
    name: string
    description?: string
    images: string[]
    price: number
    comparePrice?: number
    currency: string
    sku?: string
    stock: number
    category: ProductCategory
    isActive: boolean
    createdAt: string
    updatedAt: string
    club?: Club
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export interface OrderItem {
    id: string
    orderId: string
    productId: string
    quantity: number
    price: number
    product?: Product
}

export interface Order {
    id: string
    userId: string
    orderNumber: string
    status: OrderStatus
    subtotal: number
    tax: number
    shipping: number
    total: number
    currency: string
    shippingAddress?: Record<string, any>
    trackingNumber?: string
    paymentMethod?: string
    paymentStatus: PaymentStatus
    paidAt?: string
    createdAt: string
    updatedAt: string
    user?: User
    items?: OrderItem[]
}

// ==================== BADGE TYPES ====================

export enum BadgeType {
    EVENT = 'EVENT',
    MEMBERSHIP = 'MEMBERSHIP',
    ACCESS = 'ACCESS',
    VIP = 'VIP',
}

export interface Badge {
    id: string
    userId: string
    eventId?: string
    badgeType: BadgeType
    name: string
    role?: string
    qrCode: string
    imageUrl?: string
    isActive: boolean
    createdAt: string
    expiresAt?: string
    user?: User
}

// ==================== NOTIFICATION TYPES ====================

export enum NotificationType {
    EVENT = 'EVENT',
    TICKET = 'TICKET',
    ORDER = 'ORDER',
    CLUB = 'CLUB',
    SYSTEM = 'SYSTEM',
}

export interface Notification {
    id: string
    userId: string
    title: string
    message: string
    type: NotificationType
    data?: Record<string, any>
    isRead: boolean
    createdAt: string
    user?: User
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
    success: boolean
    data?: T
    message?: string
    error?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

// ==================== FORM TYPES ====================

export interface LoginFormData {
    email: string
    password: string
}

export interface RegisterFormData {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
}

export interface CreateEventFormData {
    title: string
    description?: string
    venue: string
    address?: string
    city: string
    country: string
    startDate: string
    endDate?: string
    category: EventCategory
    maxAttendees?: number
    isPublic: boolean
}

export interface CreateClubFormData {
    name: string
    description?: string
    email: string
    phone?: string
    website?: string
    address?: string
    city?: string
    country?: string
}
