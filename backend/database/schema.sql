
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS console (
    id_console UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    console_type VARCHAR(50) NOT NULL, 
    quantity INTEGER NOT NULL DEFAULT 1,
    package VARCHAR(50),                    
    hourly_price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS station (
    id_station UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_console UUID UNIQUE, 
    name_station VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_console
        FOREIGN KEY (id_console)
        REFERENCES console(id_console)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS session (
    id_session UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_station UUID,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    total_price INTEGER,
    status VARCHAR(20) DEFAULT 'playing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_station_session
        FOREIGN KEY (id_station)
        REFERENCES station(id_station)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS booking (
    id_booking UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_station UUID,
    customer_name VARCHAR(100) NOT NULL,
    booking_start TIMESTAMP,
    booking_end TIMESTAMP,
    status VARCHAR(20) DEFAULT 'booking',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_station_booking
        FOREIGN KEY (id_station)
        REFERENCES station(id_station)
        ON DELETE CASCADE
);