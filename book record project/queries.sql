-- Create books table

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 10),
    review TEXT,
    date_read DATE NOT NULL
);

-- Sample Data

INSERT INTO books (
    title,
    author,
    isbn,
    rating,
    review,
    date_read
) VALUES
(
    'Atomic Habits',
    'James Clear',
    '9780735211292',
    7,
    'Atomic Habits explains how small, consistent improvements compound into remarkable long-term results. The book focuses on building good habits through identity-based behavior change and practical systems rather than relying on motivation alone.',
    '2025-06-01'
),
(
    'Deep Work',
    'Cal Newport',
    '9781455586691',
    8,
    'Deep Work argues that the ability to focus without distraction is becoming increasingly valuable in a world filled with constant interruptions. Newport provides strategies for cultivating deep concentration and producing high-quality work.',
    '2025-06-10'
);