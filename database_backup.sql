--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appointments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    patient_id uuid,
    doctor_id uuid,
    appointment_date date NOT NULL,
    appointment_time time without time zone NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    reason text,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT appointments_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    session_id character varying(100) NOT NULL,
    user_id uuid,
    message text NOT NULL,
    sender character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chat_messages_sender_check CHECK (((sender)::text = ANY ((ARRAY['user'::character varying, 'bot'::character varying, 'staff'::character varying])::text[])))
);


--
-- Name: consent_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consent_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    consent_type character varying(50) NOT NULL,
    consented boolean NOT NULL,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: doctor_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctor_schedules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    doctor_id uuid,
    day_of_week integer,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    max_patients integer DEFAULT 20,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT doctor_schedules_day_of_week_check CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);


--
-- Name: doctors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctors (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    specialization character varying(100) NOT NULL,
    license_number character varying(50) NOT NULL,
    bio text,
    photo_url character varying(500),
    consultation_fee numeric(10,2),
    is_available boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    department character varying(100)
);


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    content text NOT NULL,
    excerpt text,
    image_url character varying(500),
    author_id uuid,
    is_published boolean DEFAULT false,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    icon character varying(50),
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category character varying(50) DEFAULT 'General'::character varying,
    is_featured boolean DEFAULT false
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone character varying(20),
    role character varying(20) DEFAULT 'patient'::character varying,
    is_active boolean DEFAULT true,
    email_verified boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['patient'::character varying, 'doctor'::character varying, 'admin'::character varying])::text[])))
);


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.appointments (id, patient_id, doctor_id, appointment_date, appointment_time, status, reason, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat_messages (id, session_id, user_id, message, sender, created_at) FROM stdin;
75967209-85e7-4dee-a661-258689e8ef38	Km_lgPf9e7x8Uw_1AAAC	\N	hi	user	2026-01-13 17:01:28.18808
7998e22d-414d-495a-ae85-c9ff98d04662	Km_lgPf9e7x8Uw_1AAAC	\N	Hello! Welcome to Socsargen Hospital. How can I help you today?	bot	2026-01-13 17:01:28.196774
412be55b-7318-452f-b043-b60a7898e289	Km_lgPf9e7x8Uw_1AAAC	\N	help me im sick	user	2026-01-13 17:01:41.447469
491e530b-2bf5-4dc0-a839-bf403af6b21f	Km_lgPf9e7x8Uw_1AAAC	\N	Thank you for your message. For specific inquiries, please contact our staff at (083) 123-4567 or visit our Contact page.	bot	2026-01-13 17:01:41.455061
65b8db9a-4082-4278-b1a4-9a73d034521b	Km_lgPf9e7x8Uw_1AAAC	\N	help me this doctor 	user	2026-01-13 17:01:55.264923
db631aaa-0e9d-479e-993e-215694b3e385	Km_lgPf9e7x8Uw_1AAAC	\N	Hello! Welcome to Socsargen Hospital. How can I help you today?	bot	2026-01-13 17:01:55.272732
ef338549-4b88-4fac-9d99-ec44e3f25636	CSvY_LB4i0FVloy9AAAE	\N	hi	user	2026-01-13 18:20:42.508344
1ebb0aee-37b8-4fe1-8068-a2096636ed3d	CSvY_LB4i0FVloy9AAAE	\N	Hello! Welcome to Socsargen County Hospital. How can I help you today?	bot	2026-01-13 18:20:42.517809
\.


--
-- Data for Name: consent_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.consent_logs (id, user_id, consent_type, consented, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: doctor_schedules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.doctor_schedules (id, doctor_id, day_of_week, start_time, end_time, max_patients, created_at) FROM stdin;
4b42fdfe-68b4-4f56-8a77-a901691bb914	2af4fe8e-32b8-46f8-8e92-f0f3306e02ba	1	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
3d077a19-3601-491b-9756-02bbfbd60557	e8aa3771-6e95-4dc3-8e4b-27fe5aaef41b	1	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
edd57bdc-efbc-4c12-9932-a3436d09050e	cd1df65d-a86b-4551-8458-925968a7c71a	1	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
7c79cb24-8264-4a7d-a46c-8fca0aa4a56c	2af4fe8e-32b8-46f8-8e92-f0f3306e02ba	2	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
ba203a5f-7fb6-4746-b849-978a3867378e	e8aa3771-6e95-4dc3-8e4b-27fe5aaef41b	2	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
b082ed73-9da9-4cbd-bf5c-acf2c5d905ef	cd1df65d-a86b-4551-8458-925968a7c71a	2	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
12dcf26c-9c9e-47ff-bb84-46c539701bc7	2af4fe8e-32b8-46f8-8e92-f0f3306e02ba	3	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
36583c75-9f80-4811-bea6-cb06be0be22c	e8aa3771-6e95-4dc3-8e4b-27fe5aaef41b	3	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
cfd7914b-906d-42c0-9a2a-db3bc19952c0	cd1df65d-a86b-4551-8458-925968a7c71a	3	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
21f8bb58-f72b-44a4-b71b-e44437cb5b3e	2af4fe8e-32b8-46f8-8e92-f0f3306e02ba	4	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
aaa71f52-92f9-4e99-a5a2-9efcfc6e5774	e8aa3771-6e95-4dc3-8e4b-27fe5aaef41b	4	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
b97a9c48-2fe1-490e-81c2-0df7eb4cae4d	cd1df65d-a86b-4551-8458-925968a7c71a	4	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
dae9d671-91f4-4770-b3f6-634b781d39ea	2af4fe8e-32b8-46f8-8e92-f0f3306e02ba	5	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
2943a3dd-692a-477c-9a20-c0a00ccb4b44	e8aa3771-6e95-4dc3-8e4b-27fe5aaef41b	5	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
1038a63e-7155-4a98-b68d-62112a730672	cd1df65d-a86b-4551-8458-925968a7c71a	5	08:00:00	17:00:00	20	2026-01-13 16:43:39.975415
bb6ef8fc-36fe-420e-ac31-de96eb0181ce	59cc1c1b-8b62-4726-b05c-76c4575eb70a	1	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
bcced9c6-47a9-467f-981f-00a2c34a35dc	e8e09e2a-7508-485b-9fe5-fed1d7b75c3d	1	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
0195f6aa-8725-4d30-81f9-1140c4b7f98d	92c199fa-fbbe-4642-acc9-a0e92c736fae	1	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
43c9deb9-c18b-442c-8fa7-2328248ba332	59cc1c1b-8b62-4726-b05c-76c4575eb70a	2	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
9a492ee5-047e-4fee-8827-e68d8633df8a	e8e09e2a-7508-485b-9fe5-fed1d7b75c3d	2	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
9bcb42af-9912-462c-bef6-c97bb736395c	92c199fa-fbbe-4642-acc9-a0e92c736fae	2	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
33626844-dbb8-4baa-817e-61a952a5c519	59cc1c1b-8b62-4726-b05c-76c4575eb70a	3	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
ded24ced-2d0f-492b-b116-3aa06cad5c3d	e8e09e2a-7508-485b-9fe5-fed1d7b75c3d	3	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
4ccbff2e-8f0f-4797-b7b2-20a1413f5fe5	92c199fa-fbbe-4642-acc9-a0e92c736fae	3	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
4820780e-74c7-46b1-8457-0ab6d3542feb	59cc1c1b-8b62-4726-b05c-76c4575eb70a	4	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
19725d3b-b927-458e-bcb8-e5e108f3ab61	e8e09e2a-7508-485b-9fe5-fed1d7b75c3d	4	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
3263aa7f-5ea9-4ff8-b64a-fdc1a8b55900	92c199fa-fbbe-4642-acc9-a0e92c736fae	4	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
1f12870a-90a2-4cbb-9c30-118120362d69	59cc1c1b-8b62-4726-b05c-76c4575eb70a	5	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
21330497-d973-4b3b-a695-b7fb640037b1	e8e09e2a-7508-485b-9fe5-fed1d7b75c3d	5	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
7929438d-080b-44b0-ade1-19214a34c977	92c199fa-fbbe-4642-acc9-a0e92c736fae	5	08:00:00	17:00:00	20	2026-01-13 17:22:25.057451
600c3788-5485-41e1-b476-4c61679c8d37	f5c52a4d-b61e-4225-8aa5-effdad01a5de	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
055eeb5f-22e7-4dc4-ad4b-439e90cf6b35	df2763bd-e8e7-4def-bd64-73e0cc64240c	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
91f992b5-fed6-4d36-b731-b24b51e74bf9	b8c4f968-a21c-412e-9289-b8d007106c41	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
917c7fdd-23cc-4107-8dd0-a19fa31b0dd4	47f1ce21-65bd-4a90-9a13-2afb7018b68d	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
02f0a18a-8769-4f68-a37d-4220336d2142	1ac3c87d-b20b-479d-9e87-4150d621ef01	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
6c027204-cb88-434d-b05a-fc2cbfb3b915	8c6b8c38-2c3b-4734-8542-0bd269be51c7	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
d4d63383-3c26-4b96-81c6-9c708d6ace71	2398b176-c8a1-48f6-85a8-b58b1e1fa290	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
c76e36f1-201d-4590-8493-c385e1a47164	39c52a7a-ce33-479f-bed0-46785b4665af	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
cef8a156-f523-4b67-9efc-b813b7f108fd	414a93a3-4227-4c03-89ba-08c1a011100e	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
77a3edc1-c93b-4af1-9746-7460aeca51fd	b3bb7803-2d3e-4f92-8bdc-46cd37ca52f6	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
e4a5d39a-a976-4b42-977b-24ac6b457103	e6523fef-c19d-46d2-9c4c-edcafa8a7636	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
232195f8-d58b-4ae8-bbe2-395cdc2f9248	baf3f587-bc29-4fd5-b5d1-b79edd677d85	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
059a02fc-87b2-4387-b36f-19595e81941d	b4a0bb66-6716-4fa6-ada3-2d7708d6ee17	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
3190f76b-ecc3-4eba-95b8-1ebdb485f76a	3154f70b-6241-4ae8-826e-2ceda6dbf66f	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
38a6654a-f13d-4a7c-8018-136d898d2f9a	ab2e6cb6-ddaa-4687-8bf3-8d25ca94c418	1	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
68a42882-6f4e-4a3c-983e-91c6055c8e08	f5c52a4d-b61e-4225-8aa5-effdad01a5de	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
d56ec892-74bc-4d7d-aed1-8fb65fa275f9	df2763bd-e8e7-4def-bd64-73e0cc64240c	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
485097af-de1c-416f-b555-5321d6f87796	b8c4f968-a21c-412e-9289-b8d007106c41	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
b79894d9-aaf6-4115-b8e8-dfe003688c68	47f1ce21-65bd-4a90-9a13-2afb7018b68d	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
159dbb59-60dc-463b-8434-94bb14c56f09	1ac3c87d-b20b-479d-9e87-4150d621ef01	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
b84aa1a7-19af-4a5e-b3e0-7256f895b476	8c6b8c38-2c3b-4734-8542-0bd269be51c7	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
5999e8f0-e29c-42bb-b35b-f23ac5e7d20c	2398b176-c8a1-48f6-85a8-b58b1e1fa290	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
6422f8e0-7cc6-4eca-bc48-9812228eeb22	39c52a7a-ce33-479f-bed0-46785b4665af	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
46b90302-5215-4c42-a25c-ee304b2f3aad	414a93a3-4227-4c03-89ba-08c1a011100e	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
6d87c244-c173-4e88-8f67-813d3302384e	b3bb7803-2d3e-4f92-8bdc-46cd37ca52f6	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
8cb2ea10-95c2-4a0b-afcc-f75a48caae34	e6523fef-c19d-46d2-9c4c-edcafa8a7636	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
95d51831-79b1-4001-9264-44c69992afbb	baf3f587-bc29-4fd5-b5d1-b79edd677d85	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
d9fc98c1-58d7-48ab-a799-6dc98c51075d	b4a0bb66-6716-4fa6-ada3-2d7708d6ee17	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
ab54d7b1-28b3-4a99-9f85-25a67d22f118	3154f70b-6241-4ae8-826e-2ceda6dbf66f	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
71618e36-3fe9-4e44-8543-a29e4c9f1df5	ab2e6cb6-ddaa-4687-8bf3-8d25ca94c418	2	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
b999305e-89cc-4e46-8292-0e5f0c8a4a89	f5c52a4d-b61e-4225-8aa5-effdad01a5de	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
e67d5db7-ca33-4109-9f9e-295993ac0810	df2763bd-e8e7-4def-bd64-73e0cc64240c	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
009589a0-f56c-4f0b-912d-d5798a1ccc50	b8c4f968-a21c-412e-9289-b8d007106c41	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
f99e90c6-8d60-4dd1-816c-7796e690f614	47f1ce21-65bd-4a90-9a13-2afb7018b68d	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
4fb435e9-14b6-4284-8161-066400dde97a	1ac3c87d-b20b-479d-9e87-4150d621ef01	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
2a9739dc-acb4-4e59-87eb-84cf4cfe975d	8c6b8c38-2c3b-4734-8542-0bd269be51c7	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
0a4a7f70-f140-4e20-b7a7-88218f40770c	2398b176-c8a1-48f6-85a8-b58b1e1fa290	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
3578420d-9245-4c4a-9cba-392a8b208622	39c52a7a-ce33-479f-bed0-46785b4665af	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
b3eb66d6-7f1a-4790-ad35-187ac7bb2209	414a93a3-4227-4c03-89ba-08c1a011100e	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
ee700f22-0d58-4cea-aada-fcb8fb3bf51a	b3bb7803-2d3e-4f92-8bdc-46cd37ca52f6	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
95279b13-b930-42c7-9cc0-29b0287a7763	e6523fef-c19d-46d2-9c4c-edcafa8a7636	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
e33952b0-6a18-416a-86e7-d90811abaf10	baf3f587-bc29-4fd5-b5d1-b79edd677d85	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
780d5c00-ef22-4ac4-a56d-52841ab74902	b4a0bb66-6716-4fa6-ada3-2d7708d6ee17	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
3c1ba0ab-4580-4b60-9bf4-6188a1217c10	3154f70b-6241-4ae8-826e-2ceda6dbf66f	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
897a6161-d46b-4d3c-bfcb-e3253cf31d9e	ab2e6cb6-ddaa-4687-8bf3-8d25ca94c418	3	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
9cc6fe81-12b9-45e3-a611-e7d7e3d8782f	f5c52a4d-b61e-4225-8aa5-effdad01a5de	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
0f844d86-bfcc-4ef9-a061-206a600c3bcc	df2763bd-e8e7-4def-bd64-73e0cc64240c	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
f59d6c36-6469-4a24-87bf-107183946e80	b8c4f968-a21c-412e-9289-b8d007106c41	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
c2a0cdd8-34bc-46e6-a5c6-4858fdecfd04	47f1ce21-65bd-4a90-9a13-2afb7018b68d	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
fc09f07d-9c13-43c7-a7e7-1582b201687d	1ac3c87d-b20b-479d-9e87-4150d621ef01	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
bf4315e8-f27e-4793-b290-892ed03bead0	8c6b8c38-2c3b-4734-8542-0bd269be51c7	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
24401c94-2072-4414-8a98-c1d5fd88ae32	2398b176-c8a1-48f6-85a8-b58b1e1fa290	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
5d435e2b-2fb2-447c-8a10-b7f1902ed3d6	39c52a7a-ce33-479f-bed0-46785b4665af	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
c1f444df-28a4-4b54-9f8b-5e3102d3eaa5	414a93a3-4227-4c03-89ba-08c1a011100e	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
786cb0ea-ca85-4481-b8e9-100fb505f11c	b3bb7803-2d3e-4f92-8bdc-46cd37ca52f6	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
2d0acc35-05d6-475c-b716-c0673ff65717	e6523fef-c19d-46d2-9c4c-edcafa8a7636	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
b0189c29-22be-4c88-a013-553b9ad16b84	baf3f587-bc29-4fd5-b5d1-b79edd677d85	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
2ba3dc74-1ab8-45b0-92e8-5ec289fbfc68	b4a0bb66-6716-4fa6-ada3-2d7708d6ee17	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
71ddcb9d-c1e7-4c87-914a-cd1a79d22ad1	3154f70b-6241-4ae8-826e-2ceda6dbf66f	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
68754235-f1f9-45b2-ba68-5c43f638e1ca	ab2e6cb6-ddaa-4687-8bf3-8d25ca94c418	4	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
a02b6340-9a6a-4035-bc67-fb2cdcd4ebf8	f5c52a4d-b61e-4225-8aa5-effdad01a5de	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
2be2f93e-0b86-4765-a727-11dadc7d76ab	df2763bd-e8e7-4def-bd64-73e0cc64240c	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
1bfd7663-016e-4cc8-af28-4d31fbe03bf5	b8c4f968-a21c-412e-9289-b8d007106c41	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
156d2c69-136f-4923-b837-a178ae5721a5	47f1ce21-65bd-4a90-9a13-2afb7018b68d	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
d23b2511-9cce-48af-bc78-78e6e5262ff7	1ac3c87d-b20b-479d-9e87-4150d621ef01	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
d4d36593-c468-4f0f-b4f4-b928be03134c	8c6b8c38-2c3b-4734-8542-0bd269be51c7	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
22a4f199-29f4-41a4-a343-f4754a079add	2398b176-c8a1-48f6-85a8-b58b1e1fa290	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
7f9fd407-d049-4030-9d81-fb6cd8588a91	39c52a7a-ce33-479f-bed0-46785b4665af	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
7ac79784-f556-486f-9433-eb7fc9727301	414a93a3-4227-4c03-89ba-08c1a011100e	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
35f1da03-fa0c-47af-aff6-fe87f0a1766e	b3bb7803-2d3e-4f92-8bdc-46cd37ca52f6	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
5f9be1a4-f7f7-4af1-a925-0bde6125c911	e6523fef-c19d-46d2-9c4c-edcafa8a7636	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
9409b024-9abd-4a51-a459-2babe1389ae7	baf3f587-bc29-4fd5-b5d1-b79edd677d85	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
71130ae8-7f9d-45ae-96fc-8844e4cc095c	b4a0bb66-6716-4fa6-ada3-2d7708d6ee17	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
40fdcc2e-3755-401a-a3a9-93e6db6fd733	3154f70b-6241-4ae8-826e-2ceda6dbf66f	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
a5c4678e-f0fd-422c-b488-1e57652b89ed	ab2e6cb6-ddaa-4687-8bf3-8d25ca94c418	5	08:00:00	17:00:00	20	2026-01-13 23:56:22.309885
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.doctors (id, user_id, specialization, license_number, bio, photo_url, consultation_fee, is_available, created_at, updated_at, department) FROM stdin;
2af4fe8e-32b8-46f8-8e92-f0f3306e02ba	d1111111-1111-1111-1111-111111111111	General Medicine	PRC-12345	Dr. Maria Santos is a board-certified general practitioner with over 10 years of experience in primary healthcare.	\N	500.00	t	2026-01-13 16:43:39.975415	2026-01-13 16:43:39.975415	\N
e8aa3771-6e95-4dc3-8e4b-27fe5aaef41b	d2222222-2222-2222-2222-222222222222	Pediatrics	PRC-23456	Dr. Juan Reyes specializes in child healthcare and development, with expertise in childhood diseases and immunization.	\N	600.00	t	2026-01-13 16:43:39.975415	2026-01-13 16:43:39.975415	\N
cd1df65d-a86b-4551-8458-925968a7c71a	d3333333-3333-3333-3333-333333333333	OB-Gynecology	PRC-34567	Dr. Ana Cruz is a dedicated OB-GYN specialist focused on womens health, prenatal care, and reproductive medicine.	\N	700.00	t	2026-01-13 16:43:39.975415	2026-01-13 16:43:39.975415	\N
59cc1c1b-8b62-4726-b05c-76c4575eb70a	d1111111-1111-1111-1111-111111111111	General Medicine	PRC-12345	Dr. Maria Santos is a board-certified general practitioner with over 10 years of experience in primary healthcare.	\N	500.00	t	2026-01-13 17:22:25.057451	2026-01-13 17:22:25.057451	\N
e8e09e2a-7508-485b-9fe5-fed1d7b75c3d	d2222222-2222-2222-2222-222222222222	Pediatrics	PRC-23456	Dr. Juan Reyes specializes in child healthcare and development, with expertise in childhood diseases and immunization.	\N	600.00	t	2026-01-13 17:22:25.057451	2026-01-13 17:22:25.057451	\N
92c199fa-fbbe-4642-acc9-a0e92c736fae	d3333333-3333-3333-3333-333333333333	OB-Gynecology	PRC-34567	Dr. Ana Cruz is a dedicated OB-GYN specialist focused on womens health, prenatal care, and reproductive medicine.	\N	700.00	t	2026-01-13 17:22:25.057451	2026-01-13 17:22:25.057451	\N
f5c52a4d-b61e-4225-8aa5-effdad01a5de	d1111111-1111-1111-1111-111111111111	Internal Medicine	PRC-12345	Dr. Maria Santos is a board-certified internist with over 10 years of experience in diagnosing and treating adult diseases.	\N	500.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Internal Medicine
df2763bd-e8e7-4def-bd64-73e0cc64240c	d2222222-2222-2222-2222-222222222222	Pediatrics	PRC-23456	Dr. Juan Reyes specializes in child healthcare and development, with expertise in childhood diseases and immunization.	\N	600.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Pediatrics
b8c4f968-a21c-412e-9289-b8d007106c41	d3333333-3333-3333-3333-333333333333	OB-Gynecology	PRC-34567	Dr. Ana Cruz is a dedicated OB-GYN specialist focused on womens health, prenatal care, and reproductive medicine.	\N	700.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of OB-GYN
47f1ce21-65bd-4a90-9a13-2afb7018b68d	d4444444-4444-4444-4444-444444444444	Cardiology	PRC-45678	Dr. Carlos Garcia is a board-certified cardiologist specializing in heart disease diagnosis and treatment.	\N	800.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Cardiology
1ac3c87d-b20b-479d-9e87-4150d621ef01	d5555555-5555-5555-5555-555555555555	Orthopedics	PRC-56789	Dr. Elena Mendoza specializes in bone and joint disorders, sports injuries, and orthopedic surgery.	\N	750.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Orthopedics
8c6b8c38-2c3b-4734-8542-0bd269be51c7	d6666666-6666-6666-6666-666666666666	Neurology	PRC-67890	Dr. Roberto Villanueva is an expert in diagnosing and treating disorders of the nervous system.	\N	850.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Neurology
2398b176-c8a1-48f6-85a8-b58b1e1fa290	d7777777-7777-7777-7777-777777777777	Gastroenterology	PRC-78901	Dr. Patricia Torres specializes in digestive system disorders and gastrointestinal diseases.	\N	750.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Gastroenterology
39c52a7a-ce33-479f-bed0-46785b4665af	d8888888-8888-8888-8888-888888888888	Oncology	PRC-89012	Dr. Miguel Bautista is dedicated to cancer diagnosis, treatment, and patient care.	\N	900.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Oncology
414a93a3-4227-4c03-89ba-08c1a011100e	d9999999-9999-9999-9999-999999999999	General Surgery	PRC-90123	Dr. Isabel Fernandez is an experienced general surgeon performing various surgical procedures.	\N	800.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Surgery
b3bb7803-2d3e-4f92-8bdc-46cd37ca52f6	da111111-1111-1111-1111-111111111111	Anesthesiology	PRC-01234	Dr. Antonio Ramos specializes in anesthesia and perioperative medicine for surgical patients.	\N	700.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Anesthesiology
e6523fef-c19d-46d2-9c4c-edcafa8a7636	db222222-2222-2222-2222-222222222222	Family Medicine	PRC-11234	Dr. Carmen Castro provides comprehensive healthcare for patients of all ages as a family medicine specialist.	\N	500.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Family Medicine
baf3f587-bc29-4fd5-b5d1-b79edd677d85	dc333333-3333-3333-3333-333333333333	Dental Medicine	PRC-21234	Dr. David Aquino is a skilled dentist providing comprehensive dental care and oral health services.	\N	450.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Dental Medicine
b4a0bb66-6716-4fa6-ada3-2d7708d6ee17	dd444444-4444-4444-4444-444444444444	Pathology	PRC-31234	Dr. Rosa Navarro specializes in laboratory medicine and disease diagnosis through tissue analysis.	\N	650.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Pathology
3154f70b-6241-4ae8-826e-2ceda6dbf66f	de555555-5555-5555-5555-555555555555	Radiology	PRC-41234	Dr. Fernando Ocampo is an expert in medical imaging and diagnostic radiology services.	\N	600.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Radiology
ab2e6cb6-ddaa-4687-8bf3-8d25ca94c418	df666666-6666-6666-6666-666666666666	Cardiology	PRC-51234	Dr. Lucia Del Rosario specializes in interventional cardiology and heart disease prevention.	\N	850.00	t	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885	Department of Cardiology
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news (id, title, slug, content, excerpt, image_url, author_id, is_published, published_at, created_at, updated_at) FROM stdin;
f62ba04f-0770-4bde-bd2c-f1bec0fb8a0c	Welcome to Socsargen Hospital Online Services	welcome-to-socsargen-hospital-online-services	We are excited to announce the launch of our new online appointment booking system. Patients can now easily schedule appointments with our doctors from the comfort of their homes. Our new system features an easy-to-use interface for booking appointments, real-time availability checking, and instant confirmation. Register today and experience healthcare made convenient!	We are excited to announce the launch of our new online appointment booking system.	\N	37ce2075-2e4c-443b-8942-43c848e3feda	t	2026-01-13 16:43:39.975415	2026-01-13 16:43:39.975415	2026-01-13 16:43:39.975415
9b51ff01-5c1c-4b07-9636-c32e222fcc2a	COVID-19 Safety Protocols Update	covid-19-safety-protocols-update	Socsargen Hospital continues to implement strict COVID-19 safety protocols to ensure the safety of our patients and staff. All visitors are required to wear masks, undergo temperature screening, and practice proper hand hygiene. We have also implemented social distancing measures in our waiting areas. Your health and safety remain our top priority.	Socsargen Hospital continues to implement strict COVID-19 safety protocols.	\N	37ce2075-2e4c-443b-8942-43c848e3feda	t	2026-01-12 16:43:39.975415	2026-01-13 16:43:39.975415	2026-01-13 16:43:39.975415
2895f8a3-ab7f-4d51-b6ad-ebc90f73ca47	New Pediatric Wing Now Open	new-pediatric-wing-now-open	We are proud to announce the opening of our new Pediatric Wing, designed specifically with children in mind. The wing features child-friendly decor, a dedicated play area, and specialized equipment for pediatric care. Our team of pediatric specialists is ready to provide the best care for your little ones in a comfortable and welcoming environment.	We are proud to announce the opening of our new Pediatric Wing.	\N	37ce2075-2e4c-443b-8942-43c848e3feda	t	2026-01-10 16:43:39.975415	2026-01-13 16:43:39.975415	2026-01-13 16:43:39.975415
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.services (id, name, description, icon, is_active, display_order, created_at, category, is_featured) FROM stdin;
6e917338-0580-4e78-89ec-009921778593	Catheterization Laboratory	Advanced cardiac catheterization procedures for diagnosis and treatment of heart conditions.	heart	t	1	2026-01-13 23:56:22.309885	Cardiac	f
0aa0fe13-a12a-4cff-98ae-ea522c359ce5	Open-Heart Surgeries	Complex cardiac surgical procedures performed by experienced cardiac surgeons with state-of-the-art equipment.	heart	t	2	2026-01-13 23:56:22.309885	Cardiac	f
79d3253c-ffcf-4d9d-9aa9-56d31d2da1f6	Bypass Surgery	Coronary artery bypass grafting (CABG) for patients with coronary artery disease.	heart	t	3	2026-01-13 23:56:22.309885	Cardiac	f
5c24d290-41c4-4e3e-8d32-a626b6fe5927	Endovascular Aneurysm Repair	Minimally invasive aneurysm treatment using advanced endovascular techniques.	heart	t	4	2026-01-13 23:56:22.309885	Cardiac	f
10ad9108-da84-402d-ad1f-4a22b1492336	MRI	Magnetic Resonance Imaging for detailed internal body imaging without radiation.	radiology	t	5	2026-01-13 23:56:22.309885	Diagnostic	f
ff3f084f-7663-4545-8bed-ec32d6d75756	Cancer Care Center	Comprehensive cancer treatment and care with multidisciplinary approach.	medical	t	6	2026-01-13 23:56:22.309885	Specialty	f
374377a0-370c-466a-b244-29971cac6b74	Chemotherapy	Cancer treatment using chemical agents administered by specialized oncology staff.	medical	t	7	2026-01-13 23:56:22.309885	Specialty	f
43d7a131-82b4-485c-b90e-0de6acdcc27b	OR/DR	Operating Room and Delivery Room facilities with modern surgical and birthing equipment.	surgery	t	8	2026-01-13 23:56:22.309885	Surgical	f
1458a6e7-4990-4541-b00b-25ada1f376c4	NICU	Neonatal Intensive Care Unit providing specialized care for critically ill newborns.	baby	t	9	2026-01-13 23:56:22.309885	Specialty	f
db15f5cf-1328-4361-9a69-6fffc20b19d3	ICU	Intensive Care Unit providing optimum healthcare service for patients needing special 24-hour care. Excellent facilities including intensive care equipment for complete patient monitoring.	emergency	t	10	2026-01-13 23:56:22.309885	Emergency	t
debff813-6a92-460a-a717-05d6837df2d8	Outpatient Emergency Care	Emergency services for outpatients requiring immediate medical attention.	emergency	t	11	2026-01-13 23:56:22.309885	Emergency	f
c47ea806-fa41-413b-9ccf-5f91fb79c6f7	Urgent Care Center	Immediate care for non-life-threatening conditions without the need for an appointment.	emergency	t	12	2026-01-13 23:56:22.309885	Emergency	f
3400a40f-c81f-40f2-8c5b-03615e3f43b4	Outpatient Services	Medical services without overnight stay, including consultations and minor procedures.	outpatient	t	13	2026-01-13 23:56:22.309885	Outpatient	f
2a044ff6-36dc-4373-b420-c3c3113cb336	Express Care Center	Quick consultations and treatments for minor health concerns.	outpatient	t	14	2026-01-13 23:56:22.309885	Outpatient	f
9da491d4-c5c3-4173-aeb3-0a0fc6761622	Satellite Clinic (Alabel)	Branch clinic in Alabel providing accessible healthcare services to the community.	clinic	t	15	2026-01-13 23:56:22.309885	Outpatient	f
e285e095-d86d-4566-b02b-6b83b42ad7ec	Medical Arts Tower	Specialist consultations with various medical specialists in one convenient location.	building	t	16	2026-01-13 23:56:22.309885	Outpatient	f
a57121f4-ed55-4d5b-9afa-3aa3e4835848	Laboratory	Comprehensive and advanced laboratory services. Precise, accurate and fast clinical diagnosis. Highly competent medical technologists and technicians.	lab	t	17	2026-01-13 23:56:22.309885	Diagnostic	t
bdc59b40-128a-498c-a2d5-a280fc793d73	Radiology / Imaging	Diagnostic X-ray, General Ultrasonography, Computerized Tomography, MRI (soon), and Mammography with most technologically advanced equipment.	radiology	t	18	2026-01-13 23:56:22.309885	Diagnostic	t
3d2f8949-01ec-4ffd-9cd8-8a0ab04d2c2e	Cardio-Pulmonary	Heart and lung diagnostics including ECG, stress tests, and pulmonary function tests.	heart	t	19	2026-01-13 23:56:22.309885	Diagnostic	f
7624a766-3214-424d-bb0e-057d264b6dad	Sleep Studies	Sleep disorder diagnosis through comprehensive sleep monitoring and analysis.	sleep	t	20	2026-01-13 23:56:22.309885	Diagnostic	f
6a5e3385-be1c-4d32-bb68-2687283e2b2c	Physical Therapy	Physical rehabilitation services to help patients recover mobility and function.	therapy	t	21	2026-01-13 23:56:22.309885	Rehabilitation	f
dd4f2e3d-3d92-41f6-80da-46efe66c3228	Occupational Therapy	Daily activities therapy to help patients regain independence in everyday tasks.	therapy	t	22	2026-01-13 23:56:22.309885	Rehabilitation	f
03cabf9f-ee4b-41ce-b23b-86bebee55e32	Speech Therapy	Speech and language treatment for patients with communication disorders.	speech	t	23	2026-01-13 23:56:22.309885	Rehabilitation	f
666462b8-2f13-45a8-a548-52daa14c5580	Educational Therapy	Learning support therapy for patients with educational and developmental needs.	education	t	24	2026-01-13 23:56:22.309885	Rehabilitation	f
2482bb59-f557-4b5c-bf77-0a30cb8c822b	Dental Services	State-of-the-art facility at Medical Plaza. Highly competent doctors for all dental needs including preventive, restorative, and cosmetic dentistry.	dental	t	25	2026-01-13 23:56:22.309885	Specialty	t
6d7e3f0f-7e6a-4202-8cc6-07fb9ccdce07	Hemodialysis	Home away from home with comfortable lazy boy chairs for clients undergoing Hemodialysis. Top of the line Hemodialysis Machines and well trained staff. Most affordable rate for Hemodialysis Service.	kidney	t	26	2026-01-13 23:56:22.309885	Specialty	t
f3022b3d-5406-4b08-a090-5a2119ed4d73	Nutrition & Dietetics	Nutritional counseling and dietary planning for patients with various health conditions.	nutrition	t	27	2026-01-13 23:56:22.309885	Specialty	f
1f42c852-dadb-4528-b91d-f72c2a637da3	Heart Station	Today's lifestyles and rapid changing environments, cardiovascular diseases have become the most leading cause of mortality. The SCH heart station offers the best diagnostic service with excellent facilities and highly skilled personnel.	heart	t	28	2026-01-13 23:56:22.309885	Cardiac	t
f651ed32-5c55-4270-b042-348f2b299e48	Rehabilitation Medicine Department	Composed of very experienced licensed Physical Therapists and Physiatrists. First and only EMG-NCV machine that measures muscle response or electrical activity.	therapy	t	29	2026-01-13 23:56:22.309885	Rehabilitation	t
7d1ef0fa-7838-4af4-bea8-5e0d2f97aed9	Digestive Endoscopy Unit	Fast, safe, and effective diagnosis of gastrointestinal diseases. Diagnostic and therapeutic procedures of the upper and lower gastrointestinal tract.	medical	t	30	2026-01-13 23:56:22.309885	Diagnostic	t
081b0d3f-78d0-46fb-9864-78803a5b7078	Emergency Services	Expert emergency physicians trained in Emergency Medicine with Nursing staff adept in Advance Life Support and Triaging. 24 hours a day service.	emergency	t	31	2026-01-13 23:56:22.309885	Emergency	t
3908fb3d-c754-4142-b7e9-d8d5a3057c3b	OFW Clinic	Only clinic of its kind in Region 12. Accredited by DOH, DOLE/POEA, and MARINA. Caters to both land-based and seafarer applicants for overseas workers and seafarers medical examinations.	clinic	t	32	2026-01-13 23:56:22.309885	Specialty	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password, first_name, last_name, phone, role, is_active, email_verified, created_at, updated_at) FROM stdin;
37ce2075-2e4c-443b-8942-43c848e3feda	admin@socsargen-hospital.com	$2a$10$oM774grA8t87pYuFyc.SROTLVax1iyFvLjMqRuZA2vUDS5Fvx/18q	Super	Admin	\N	admin	t	f	2026-01-13 16:43:39.975415	2026-01-13 16:43:39.975415
d1111111-1111-1111-1111-111111111111	dr.santos@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Maria	Santos	09171234567	doctor	t	f	2026-01-13 16:43:39.975415	2026-01-13 16:43:39.975415
d2222222-2222-2222-2222-222222222222	dr.reyes@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Juan	Reyes	09181234567	doctor	t	f	2026-01-13 16:43:39.975415	2026-01-13 16:43:39.975415
d3333333-3333-3333-3333-333333333333	dr.cruz@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Ana	Cruz	09191234567	doctor	t	f	2026-01-13 16:43:39.975415	2026-01-13 16:43:39.975415
d4444444-4444-4444-4444-444444444444	dr.garcia@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Carlos	Garcia	09201234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
d5555555-5555-5555-5555-555555555555	dr.mendoza@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Elena	Mendoza	09211234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
d6666666-6666-6666-6666-666666666666	dr.villanueva@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Roberto	Villanueva	09221234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
d7777777-7777-7777-7777-777777777777	dr.torres@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Patricia	Torres	09231234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
d8888888-8888-8888-8888-888888888888	dr.bautista@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Miguel	Bautista	09241234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
d9999999-9999-9999-9999-999999999999	dr.fernandez@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Isabel	Fernandez	09251234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
da111111-1111-1111-1111-111111111111	dr.ramos@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Antonio	Ramos	09261234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
db222222-2222-2222-2222-222222222222	dr.castro@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Carmen	Castro	09271234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
dc333333-3333-3333-3333-333333333333	dr.aquino@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	David	Aquino	09281234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
dd444444-4444-4444-4444-444444444444	dr.navarro@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Rosa	Navarro	09291234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
de555555-5555-5555-5555-555555555555	dr.ocampo@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Fernando	Ocampo	09301234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
df666666-6666-6666-6666-666666666666	dr.delrosario@socsargen-hospital.com	$2a$10$fkBsmMqFYjtlPAfSRTof/..1Bm84kNZ0koZoV4Ijh8tKFGebUZbKy	Lucia	Del Rosario	09311234567	doctor	t	f	2026-01-13 23:56:22.309885	2026-01-13 23:56:22.309885
\.


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: consent_logs consent_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consent_logs
    ADD CONSTRAINT consent_logs_pkey PRIMARY KEY (id);


--
-- Name: doctor_schedules doctor_schedules_doctor_id_day_of_week_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_schedules
    ADD CONSTRAINT doctor_schedules_doctor_id_day_of_week_key UNIQUE (doctor_id, day_of_week);


--
-- Name: doctor_schedules doctor_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_schedules
    ADD CONSTRAINT doctor_schedules_pkey PRIMARY KEY (id);


--
-- Name: doctors doctors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news news_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_slug_key UNIQUE (slug);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_appointments_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_appointments_date ON public.appointments USING btree (appointment_date);


--
-- Name: idx_appointments_doctor; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_appointments_doctor ON public.appointments USING btree (doctor_id);


--
-- Name: idx_appointments_patient; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_appointments_patient ON public.appointments USING btree (patient_id);


--
-- Name: idx_appointments_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_appointments_status ON public.appointments USING btree (status);


--
-- Name: idx_chat_session; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_chat_session ON public.chat_messages USING btree (session_id);


--
-- Name: idx_consent_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_consent_user ON public.consent_logs USING btree (user_id);


--
-- Name: idx_doctors_department; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_doctors_department ON public.doctors USING btree (department);


--
-- Name: idx_doctors_specialization; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_doctors_specialization ON public.doctors USING btree (specialization);


--
-- Name: idx_doctors_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_doctors_user_id ON public.doctors USING btree (user_id);


--
-- Name: idx_news_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_published ON public.news USING btree (is_published, published_at);


--
-- Name: idx_news_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_news_slug ON public.news USING btree (slug);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: appointments appointments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: consent_logs consent_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consent_logs
    ADD CONSTRAINT consent_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: doctor_schedules doctor_schedules_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_schedules
    ADD CONSTRAINT doctor_schedules_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE;


--
-- Name: doctors doctors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT doctors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: news news_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

