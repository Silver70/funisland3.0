## HOTEL DOMAIN

### room_types

| Column              | Type              | Constraints            | Description                     |
|---------------------|-------------------|------------------------|---------------------------------|
| id                  | bigint            | PK, increment          | Primary key                     |
| name                | varchar(255)      | -                      | Room type name                  |
| description         | text              | -                      | Detailed description            |
| base_price_per_night| decimal(10,2)     | -                      | Base price per night            |
| max_occupancy       | tinyint           | -                      | Maximum number of guests        |

### rooms

| Column         | Type         | Constraints            | Description                  |
|----------------|--------------|------------------------|------------------------------|
| id             | bigint       | PK, increment          | Primary key                  |
| room_type_id   | bigint       | FK → room_types.id     | Reference to room type       |
| room_number    | varchar(20)  | UNIQUE                 | Unique room number           |
| status         | varchar(50)  | -                      | Room status (available, etc) |

### hotel_bookings

| Column             | Type         | Constraints                  | Description                          |
|--------------------|--------------|------------------------------|--------------------------------------|
| id                 | bigint       | PK, increment                | Primary key                          |
| booking_reference  | varchar(20)  | UNIQUE                       | Unique booking reference             |
| user_id            | bigint       | FK → users.id                | User who made the booking            |
| room_id            | bigint       | FK → rooms.id                | Booked room                          |
| check_in           | date         | -                            | Check-in date                        |
| check_out          | date         | -                            | Check-out date                       |
| guests             | tinyint      | -                            | Number of guests                     |
| status             | varchar(50)  | -                            | Booking status                       |

## ⛴️ FERRY DOMAIN

### ferry_routes

| Column       | Type         | Constraints | Description                          |
|--------------|--------------|-------------|--------------------------------------|
| id           | bigint       | PK, increment | Primary key                        |
| name         | varchar(100) | -           | Route name e.g. "Island ↔ Theme Park"|
| origin       | varchar(100) | -           | Origin location                      |
| destination  | varchar(100) | -           | Destination location                 |

### ferry_schedules

| Column        | Type         | Constraints                  | Description                          |
|---------------|--------------|------------------------------|--------------------------------------|
| id            | bigint       | PK, increment                | Primary key                          |
| route_id      | bigint       | FK → ferry_routes.id         | Reference to ferry route             |
| departure_at  | datetime     | -                            | Departure date and time              |
| direction     | varchar(20)  | -                            | to_theme_park / to_island            |
| capacity      | int          | -                            | Maximum passengers                   |
| base_price    | decimal(10,2)| -                            | Base price per ticket                |
| status        | varchar(50)  | -                            | Schedule status                      |

### ferry_bookings

| Column            | Type         | Constraints                  | Description                          |
|-------------------|--------------|------------------------------|--------------------------------------|
| id                | bigint       | PK, increment                | Primary key                          |
| booking_reference | varchar(20)  | UNIQUE                       | Unique booking reference             |
| user_id           | bigint       | FK → users.id                | User who booked                      |
| schedule_id       | bigint       | FK → ferry_schedules.id      | Ferry schedule                       |
| hotel_booking_id  | bigint       | FK → hotel_bookings.id       | Linked hotel booking                 |
| passenger_count   | tinyint      | -                            | Number of passengers                 |
| status            | varchar(50)  | -                            | Booking status                       |

## 🎢 THEME PARK DOMAIN

### park_ticket_types

| Column | Type         | Constraints | Description          |
|--------|--------------|-------------|----------------------|
| id     | bigint       | PK, increment | Primary key        |
| name   | varchar(255) | -           | Ticket type name     |
| price  | decimal(10,2)| -           | Ticket price         |

### park_tickets

| Column           | Type         | Constraints                  | Description                     |
|------------------|--------------|------------------------------|---------------------------------|
| id               | bigint       | PK, increment                | Primary key                     |
| ticket_reference | varchar(20)  | UNIQUE                       | Unique ticket reference         |
| user_id          | bigint       | FK → users.id                | Ticket owner                    |
| ticket_type_id   | bigint       | FK → park_ticket_types.id    | Type of ticket                  |
| visit_date       | date         | -                            | Date of visit                   |
| quantity         | tinyint      | -                            | Number of tickets               |
| status           | varchar(50)  | -                            | Ticket status                   |

### events

| Column         | Type         | Constraints | Description                          |
|----------------|--------------|-------------|--------------------------------------|
| id             | bigint       | PK, increment | Primary key                        |
| name           | varchar(255) | -           | Event name                           |
| description    | text         | -           | Event description                    |
| event_type     | varchar(50)  | -           | ride, show, beach_event              |
| location_type  | varchar(50)  | -           | theme_park, beach                    |
| base_price     | decimal(10,2)| -           | Base price                           |
| is_active      | boolean      | -           | Whether event is active              |

### event_schedules

| Column      | Type         | Constraints                  | Description               |
|-------------|--------------|------------------------------|---------------------------|
| id          | bigint       | PK, increment                | Primary key               |
| event_id    | bigint       | FK → events.id               | Reference to event        |
| start_at    | datetime     | -                            | Start date and time       |
| capacity    | int          | -                            | Maximum capacity          |

### event_bookings

| Column              | Type         | Constraints                  | Description                          |
|---------------------|--------------|------------------------------|--------------------------------------|
| id                  | bigint       | PK, increment                | Primary key                          |
| booking_reference   | varchar(20)  | UNIQUE                       | Unique booking reference             |
| user_id             | bigint       | FK → users.id                | User who booked                      |
| event_schedule_id   | bigint       | FK → event_schedules.id      | Scheduled event                      |
| park_ticket_id      | bigint       | FK → park_tickets.id         | Linked park ticket                   |
| quantity            | tinyint      | -                            | Number of tickets                    |
| status              | varchar(50)  | -                            | Booking status                       |

## 💰 PAYMENTS

### payments

| Column            | Type          | Constraints                  | Description                              |
|-------------------|---------------|------------------------------|------------------------------------------|
| id                | bigint        | PK, increment                | Primary key                              |
| user_id           | bigint        | FK → users.id                | User who paid                            |
| payable_type      | varchar(50)   | -                            | hotel_booking, ferry_booking, event_booking |
| payable_id        | bigint        | -                            | ID of the related booking                |
| amount            | decimal(10,2) | -                            | Payment amount                           |
| payment_reference | char(36)      | -                            | Unique payment reference                 |
| paid_at           | timestamp     | -                            | Payment completion time                  |
| created_at        | timestamp     | -                            | Record creation time                     |

## 🎁 PROMOTIONS ENGINE

### promotions

| Column         | Type          | Constraints | Description                       |
|----------------|---------------|-------------|-----------------------------------|
| id             | bigint        | PK, increment | Primary key                     |
| name           | varchar(255)  | -           | Promotion name                    |
| description    | text          | -           | Promotion description             |
| discount_type  | varchar(20)   | -           | percentage or fixed               |
| discount_value | decimal(10,2) | -           | Discount value                    |
| valid_from     | datetime      | -           | Valid from                        |
| valid_to       | datetime      | -           | Valid until                       |
| is_active      | boolean       | -           | Active status                     |

### promotion_targets

| Column        | Type         | Constraints                  | Description                          |
|---------------|--------------|------------------------------|--------------------------------------|
| id            | bigint       | PK, increment                | Primary key                          |
| promotion_id  | bigint       | FK → promotions.id           | Reference to promotion               |
| target_type   | varchar(50)  | -                            | room_type, event, ferry_route        |
| target_id     | bigint       | -                            | ID of the target entity              |

### promotion_usages

| Column            | Type          | Constraints                  | Description                          |
|-------------------|---------------|------------------------------|--------------------------------------|
| id                | bigint        | PK, increment                | Primary key                          |
| promotion_id      | bigint        | FK → promotions.id           | Promotion used                       |
| user_id           | bigint        | FK → users.id                | User who used it                     |
| applied_to_type   | varchar(50)   | -                            | hotel_booking, ferry_booking, etc    |
| applied_to_id     | bigint        | -                            | ID of the booking applied to         |
| discount_amount   | decimal(10,2) | -                            | Actual discount given                |
| created_at        | timestamp     | -                            | When usage was recorded              |

## 🖼️ REUSABLE IMAGE SYSTEM (Polymorphic)

### images

| Column      | Type         | Constraints | Description          |
|-------------|--------------|-------------|----------------------|
| id          | bigint       | PK, increment | Primary key        |
| url         | varchar(500) | -           | Image URL            |
| created_at  | timestamp    | -           | Creation timestamp   |

### imageables

| Column          | Type         | Constraints                                      | Description                          |
|-----------------|--------------|--------------------------------------------------|--------------------------------------|
| image_id        | bigint       | FK → images.id                                   | Reference to image                   |
| imageable_id    | bigint       | -                                                | ID of the related entity             |
| imageable_type  | varchar(50)  | -                                                | room, event, advertisement, etc      |

**Note:** Composite Primary Key on `(image_id, imageable_id, imageable_type)`

## 📍 PLATFORM

### map_locations

| Column      | Type           | Constraints | Description                  |
|-------------|----------------|-------------|------------------------------|
| id          | bigint         | PK, increment | Primary key                |
| name        | varchar(255)   | -           | Location name                |
| description | text           | -           | Description                  |
| type        | varchar(50)    | -           | Location type                |
| latitude    | decimal(10,7)  | -           | Latitude coordinate          |
| longitude   | decimal(10,7)  | -           | Longitude coordinate         |

### advertisements

| Column      | Type         | Constraints | Description                    |
|-------------|--------------|-------------|--------------------------------|
| id          | bigint       | PK, increment | Primary key                 |
| title       | varchar(255) | -           | Advertisement title            |
| image       | varchar(500) | -           | Image URL                      |
| target_url  | varchar(500) | -           | URL to redirect                |
| placement   | varchar(50)  | -           | Placement location             |
| starts_at   | date         | -           | Start date                     |
| ends_at     | date         | -           | End date                       |
| is_active   | boolean      | -           | Active status                  |

## 🧾 AUDIT LOGS

### audit_logs

| Column        | Type         | Constraints | Description                          |
|---------------|--------------|-------------|--------------------------------------|
| id            | bigint       | PK, increment | Primary key                        |
| user_id       | bigint       | FK → users.id | User who performed action          |
| action        | varchar(100) | -           | Action performed                     |
| subject_type  | varchar(255) | -           | Type of subject (model name)         |
| subject_id    | bigint       | -           | ID of the subject                    |
| metadata      | json         | -           | Additional metadata                  |
| created_at    | timestamp    | -           | Log creation timestamp               |