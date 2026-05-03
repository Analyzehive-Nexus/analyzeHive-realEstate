-- Insert funny dummy leads into the pipeline
INSERT INTO leads_customers (id, name, phone, email, source, status, assigned_user_id, project_interest, flat_type_interest, notes, created_at, updated_at, last_activity)
VALUES
  -- New stage
  (gen_random_uuid(), 'Sir Barksalot', '+91 98765 00001', 'bark@woofmail.com', 'Meta', 'New', NULL, 'Tower A', '3BHK', 'Claims he is a royal dog looking for a penthouse. Brings his own throne.', now(), now(), now()),
  (gen_random_uuid(), 'Count Dracula', '+91 98765 00002', 'dracula@transylvania.com', 'Google', 'New', NULL, 'Villas', 'Villa', 'Prefers no sunlight in the living room. Asks if basement can be converted into a coffin storage.', now(), now(), now()),
  (gen_random_uuid(), 'Nacho Libre', '+91 98765 00003', 'nacho@luchador.com', 'Direct', 'New', NULL, 'Tower B', '2BHK', 'Wants a wrestling ring on the terrace. Demands free guacamole with every EMI.', now(), now(), now()),

  -- Contacted stage
  (gen_random_uuid(), 'Dr. Sheldon Cooper', '+91 98765 00004', 'sheldon@caltech.edu', '99acres', 'Contacted', NULL, 'Tower A', '1BHK', 'Requires a north‑facing window for his spot on the couch. Has a detailed contract of 38 pages.', now(), now(), now()),
  (gen_random_uuid(), 'Ron Swanson', '+91 98765 00005', 'ron@pawnee.gov', 'Meta', 'Contacted', NULL, 'Commercial Hub', 'Shop', 'Only interested if there is a dedicated bacon‑grilling station. No open floor plans.', now(), now(), now()),
  (gen_random_uuid(), 'SpongeBob SquarePants', '+91 98765 00006', 'sponge@bikinibottom.net', 'Google', 'Contacted', NULL, 'Tower B', 'Studio', 'Needs a pineapple‑shaped house. Will pay in Krabby Patties.', now(), now(), now()),

  -- Site Visit Scheduled stage
  (gen_random_uuid(), 'Tony Stark', '+91 98765 00007', 'tony@starkindustries.com', 'Referral', 'Site Visit Scheduled', NULL, 'Penthouse', '4BHK', 'Wants to install an AI‑powered home assistant. Must have space for his Iron Man suits.', now(), now(), now()),
  (gen_random_uuid(), 'Pikachu', '+91 98765 00008', 'pika@pokemon.com', 'Direct', 'Site Visit Scheduled', NULL, 'Villas', 'Villa', 'Requested a lightning‑proof roof and a berry garden. Prefers yellow paint.', now(), now(), now()),
  (gen_random_uuid(), 'Sherlock Holmes', '+91 98765 00009', 'sherlock@221b.uk', '99acres', 'Site Visit Scheduled', NULL, 'Tower A', '2BHK', 'Wants a magnifying glass on the front door. Needs a room dedicated to violin practice.', now(), now(), now()),

  -- Negotiation stage
  (gen_random_uuid(), 'Mickey Mouse', '+91 98765 00010', 'mickey@disney.com', 'Meta', 'Negotiation', NULL, 'Tower B', '3BHK', 'Bargaining hard for a discount. Demands a free Minnie Mouse‑themed welcome kit.', now(), now(), now()),
  (gen_random_uuid(), 'Gollum', '+91 98765 00011', 'gollum@precious.com', 'Google', 'Negotiation', NULL, 'Tower A', '1BHK', 'Wants to see the flat only after midnight. “My precious balcony must face the moon.”', now(), now(), now()),
  (gen_random_uuid(), 'Walter White', '+91 98765 00012', 'heisenberg@albuquerque.net', 'Direct', 'Negotiation', NULL, 'Commercial Hub', 'Shop', 'Needs a large underground space. “For my… science projects.”', now(), now(), now()),

  -- Converted stage (sold)
  (gen_random_uuid(), 'Harry Potter', '+91 98765 00013', 'harry@hogwarts.com', 'Referral', 'Converted', NULL, 'Tower A', '2BHK', 'Already closed. Wants a cupboard under the stairs for nostalgia.', now(), now(), now()),
  (gen_random_uuid(), 'Forrest Gump', '+91 98765 00014', 'forrest@run.com', '99acres', 'Converted', NULL, 'Villas', 'Villa', 'Signed the papers. “Life is like a box of chocolates… you never know what you’re gonna get.”', now(), now(), now()),
  (gen_random_uuid(), 'Leia Organa', '+91 98765 00015', 'leia@alderaan.gov', 'Meta', 'Converted', NULL, 'Tower B', '3BHK', 'Booked. Requested a holographic messaging system in the living room.', now(), now(), now());

-- Optional: If you want to assign these leads to real brokers, replace NULL with a user ID from your `users` table.
-- Example: UPDATE leads_customers SET assigned_user_id = '00000000-0000-0000-0000-000000000001' WHERE name = 'Sir Barksalot';
