DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    username TEXT UNIQUE,
    name TEXT,
    headline TEXT,
    bio TEXT,
    image TEXT,
    timestamp timestamp DEFAULT now ()
);


INSERT INTO profiles VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'kevinkoste', 'Kevin Koste', 'Kevin is a dumb shit', 'Also this is the bio', 'mizmatcat.png');
INSERT INTO profiles VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'mizmatcat', 'Matthew Mizbani', 'Matt cant design for shit', 'Also this is the bio', 'mizmatcat.png');

INSERT INTO profiles VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'johnkauber',
    'John Kauber',
    'John is a Security Engineer and Analyst passionate about protecting critical systems from threat of attack.',
    'He’s currently a security engineer at BigCo, where he’s helping to build a system wide penetration testing platform to keep BigCo’s systems safe.  A big advocate for the EFF, part-time white hat hacker, and proud member of the Information Systems Security Association, John also founded the young hacker coalition (YHC) in 2018. John loves to travel internationally, and is rarely found abroad without a camera in his hand. You can find him in San Francisco, California.',
    'mizmatcat.png'
);
