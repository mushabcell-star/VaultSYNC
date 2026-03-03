VaultSync Technical Specification & Architecture

1. Project Folder Structure (Clean Architecture)

Backend (Node.js/TypeScript)

vaultsync-backend/ ├── src/ │ ├── api/ # Express Controllers & Routes │ │ ├── controllers/ │ │ ├── middlewares/ # Auth, Logger, Error Handler │ │ └── routes/ │ ├── core/ # Business Logic (Use Cases) │ ├── data/ # Data Access Layer (Repositories) │ │ ├── models/ # PostgreSQL Schemas │ │ └── interfaces/ │ ├── config/ # DB, Redis, & Env configurations │ ├── utils/ # Encryption (AES-256), Helpers │ └── app.ts # Entry point ├── tests/ └── .env 

Frontend (Flutter)

vaultsync_flutter/ ├── lib/ │ ├── core/ # Themes, Constants, Security Utils │ ├── data/ # Repositories & Data Sources (API calls) │ ├── domain/ # Entities & Use Cases │ ├── presentation/ # UI (Screens, Widgets, State Management) │ │ ├── bloc/ │ │ ├── screens/ │ │ └── widgets/ │ └── main.dart # App Entry & Provider Setup ├── assets/ # Icons & Fonts └── pubspec.yaml 

2. Data Flow Diagram (High Level)

User Request: Flutter App (HTTPS/TLS 1.3).

API Gateway: Nginx/Load Balancer.

Authentication: JWT validation in Middleware (Redis for token rotation).

Service Layer: Processing business logic (e.g., Auto-Stash calculation).

Persistence:

PostgreSQL: Transactional data, User profiles.

Redis: Caching balance, Session management.

Integration: Open Banking API for real-time synchronization.

3. Security Implementation

JWT Rotation: Access Token (short-lived) & Refresh Token (long-lived) stored in HttpOnly cookies/Secure Storage.

AES-256: Digunakan untuk mengenkripsi data sensitif seperti nomor rekening atau saldo di level database.

Arsitektur Database VaultSync

Strategi Keamanan & Performa

UUID: Menggunakan uuid_generate_v4() sebagai Primary Key untuk mencegah enumeration attack.

Integrasi Enkripsi: Kolom sensitif seperti encrypted_balance dan encrypted_pin dirancang untuk menampung data hasil enkripsi AES-256 dari level aplikasi.

Data Integrity: Penggunaan CHECK constraints untuk memastikan saldo tidak negatif pada jenis kantong tertentu.

Indexing: B-Tree Index pada kolom yang sering digunakan dalam pencarian (email, user_id, transaction_date).

Hubungan Antar Tabel

Users (1) <---> (N) Pockets

Pockets (1) <---> (N) Transactions

Users (1) <---> (N) Security_Audit

VaultSync API Documentation (OpenAPI 3.0)

Overview

API ini melayani aplikasi Flutter VaultSync untuk manajemen tabungan pintar, integrasi multi-bank, dan fitur Auto-Stash. Semua request memerlukan autentikasi JWT kecuali endpoint Register dan Login.

Endpoints

1. Authentication

POST /api/v1/auth/register

Deskripsi: Mendaftarkan user baru dengan enkripsi PIN otomatis.

POST /api/v1/auth/login

Deskripsi: Menukarkan kredensial dengan Access Token (15m) & Refresh Token (7d).

POST /api/v1/auth/refresh

Deskripsi: Rotasi token menggunakan Refresh Token.

2. Pockets & Transactions

GET /api/v1/pockets

Deskripsi: Mengambil semua saku user (saldo didekripsi di server-side).

POST /api/v1/transactions

Deskripsi: Mencatat transaksi baru dan mentrigger algoritma Auto-Stash.

3. Security & Sync

GET /api/v1/sync/bank

Deskripsi: Sinkronisasi real-time dengan Open Banking API.

Security Schemes

BearerAuth: JWT Token di header Authorization: Bearer <token>.

AES-GCM: Semua data finansial dienkripsi sebelum persistensi database.



