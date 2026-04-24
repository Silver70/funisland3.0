
---

## 🏨 Hotel Domain
Manages accommodations and room inventory.

### Relationships
- **Room Types** (1) ── (Many) **Rooms**
- **Rooms** (1) ── (Many) **Hotel Bookings**
- **Users** (1) ── (Many) **Hotel Bookings**

### Key Foreign Keys (FKs)
- `rooms.room_type_id` → `room_types.id`
- `hotel_bookings.room_id` → `rooms.id`
- `hotel_bookings.user_id` → `users.id`

---

## ⛴️ Ferry Domain
Manages transportation routes and scheduling.

### Relationships
- **Ferry Routes** (1) ── (Many) **Ferry Schedules**
- **Ferry Schedules** (1) ── (Many) **Ferry Bookings**
- **Users** (1) ── (Many) **Ferry Bookings**
- **Hotel Bookings** (1) ── (Many) **Ferry Bookings**

### Key Foreign Keys (FKs)
- `ferry_schedules.route_id` → `ferry_routes.id`
- `ferry_bookings.schedule_id` → `ferry_schedules.id`
- `ferry_bookings.user_id` → `users.id`
- `ferry_bookings.hotel_booking_id` → `hotel_bookings.id`
  - *Business Rule: Enforces that a ferry booking requires an associated hotel booking.*

---

## 🎢 Theme Park Domain

### 🎟️ Tickets
- **Park Ticket Types** (1) ── (Many) **Park Tickets**
- **Users** (1) ── (Many) **Park Tickets**
- **FK:** `park_tickets.ticket_type_id` → `park_ticket_types.id`
- **FK:** `park_tickets.user_id` → `users.id`

### 🎡 Events
- **Events** (1) ── (Many) **Event Schedules**
- **Event Schedules** (1) ── (Many) **Event Bookings**
- **Users** (1) ── (Many) **Event Bookings**
- **Park Tickets** (1) ── (Many) **Event Bookings**
- **FK:** `event_schedules.event_id` → `events.id`
- **FK:** `event_bookings.event_schedule_id` → `event_schedules.id`
- **FK:** `event_bookings.park_ticket_id` → `park_tickets.id`
  - *Business Rule: Enforces that an event booking requires a valid park ticket.*

---

## 💳 Payments (Polymorphic)
A unified payment system supporting multiple booking types.

- **Users** (1) ── (Many) **Payments**
- **Payments** ── *belongs to* ── (**Hotel Booking** / **Ferry Booking** / **Event Booking**)
- **Polymorphic Fields:**
  - `payments.payable_type`
  - `payments.payable_id`

---

## 🎁 Promotions Engine

### Promotions → Targets
- **Promotions** (1) ── (Many) **Promotion Targets**
- **Promotion Targets** ── *belongs to* ── (**Room Type** / **Event** / **Ferry Route**)
- *Enables polymorphic targeting across different domains.*

### Promotion Usage
- **Promotions** (1) ── (Many) **Promotion Usages**
- **Users** (1) ── (Many) **Promotion Usages**
- **Promotion Usages** ── *belongs to* ── (**Hotel Booking** / **Ferry Booking** / **Event Booking**)

---

## 🖼️ Image System (Polymorphic)
A reusable asset system for visual content.

- **Images** (1) ── (Many) **Imageables**
- **Imageables** ── *belongs to* ── (**Room** / **Event** / **Advertisement**)
- **Polymorphic Fields:**
  - `imageable_type`
  - `imageable_id`

---

## 📍 Platform Essentials

### Standalone Entities
- **Map Locations:** Standalone geolocation data.
- **Advertisements:** Standalone marketing entities (can link to Images via `imageables`).

---

## 🧾 Audit Logs
System-wide tracking for administrative and security purposes.

- **Users** (1) ── (Many) **Audit Logs**
- **Audit Logs** ── *belongs to* ── **ANY Model**
- **Polymorphic Association:** Tracks changes across all database entities.