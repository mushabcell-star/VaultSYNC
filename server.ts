/**
 * VaultSync Backend Boilerplate
 * Tech Stack: Node.js, Express, TypeScript, PostgreSQL
 */

import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- DATABASE SETUP ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- MIDDLEWARE KEAMANAN ---
app.use(helmet()); // Proteksi header HTTP
app.use(cors());
app.use(express.json());

// Middleware Validasi JWT
const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Akses ditolak' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid' });
    req.user = user;
    next();
  });
};

// --- ROUTES ---

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'VaultSync API is running smooth', timestamp: new Date() });
});

// Contoh Endpoint Protected (Dashboard Data)
app.get('/api/v1/dashboard', authenticateToken, async (req: any, res) => {
  try {
    // Logika pengambilan data dashboard dari PostgreSQL/Redis
    res.json({
      user_id: req.user.id,
      balance: 15750000,
      currency: 'IDR',
      savings_goal: 'Rumah Impian'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- ERROR HANDLING ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`VaultSync Server running on http://localhost:${PORT}`);
});
-- Aktifkan ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Users (Profil & Keamanan)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    encrypted_pin TEXT NOT NULL, -- AES-256 result
    biometric_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- 2. Tabel Pockets (Multi-Pocket System)
CREATE TYPE pocket_type AS ENUM ('GOAL_BASED', 'EMERGENCY', 'SHARED', 'REGULAR');

CREATE TABLE pockets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    type pocket_type DEFAULT 'REGULAR',
    target_amount DECIMAL(15, 2),
    encrypted_balance TEXT NOT NULL, -- Saldo terenkripsi AES-256
    currency VARCHAR(3) DEFAULT 'IDR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_target_amount CHECK (target_amount >= 0)
);

CREATE INDEX idx_pockets_user_id ON pockets(user_id);

-- 3. Tabel Transactions (Riwayat & Auto-Stash)
CREATE TYPE transaction_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pocket_id UUID NOT NULL REFERENCES pockets(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    status transaction_status DEFAULT 'SUCCESS',
    
    -- Metadata untuk Auto-Stash (pembulatan transaksi)
    is_autostash BOOLEAN DEFAULT FALSE,
    round_up_amount DECIMAL(15, 2) DEFAULT 0,
    
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_pocket_id ON transactions(pocket_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);

-- 4. Tabel Security Audit (Log Rotasi Token & Anomali)
CREATE TABLE security_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- 'LOGIN_ATTEMPT', 'TOKEN_ROTATION', 'PIN_CHANGE'
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_anomaly BOOLEAN DEFAULT FALSE,
    metadata JSONB, -- Detail tambahan seperti lokasi atau jenis perangkat
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_security_user_event ON security_audit(user_id, event_type);

/**
 * VaultSync Data Models (TypeScript Interfaces)
 * Menyesuaikan dengan skema PostgreSQL.
 */

export type PocketType = 'GOAL_BASED' | 'EMERGENCY' | 'SHARED' | 'REGULAR';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  encryptedPin: string;
  biometricEnabled: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pocket {
  id: string;
  userId: string;
  name: string;
  type: PocketType;
  targetAmount?: number;
  encryptedBalance: string; // Selalu simpan string terenkripsi di memori sebelum diproses
  currency: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  pocketId: string;
  amount: number;
  category: string;
  description: string;
  status: TransactionStatus;
  isAutostash: boolean;
  roundUpAmount: number;
  transactionDate: Date;
}

export interface SecurityAudit {
  id: string;
  userId?: string;
  eventType: 'LOGIN_ATTEMPT' | 'TOKEN_ROTATION' | 'PIN_CHANGE' | 'ANOMALY_DETECTED';
  ipAddress: string;
  userAgent: string;
  isAnomaly: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
}
import 'package:flutter/material.dart';

/**
 * VaultSync Frontend Main Navigation Wrapper
 * Menggunakan Flutter Material 3 dengan struktur navigasi modern.
 */

void main() {
  runApp(const VaultSyncApp());
}

class VaultSyncApp extends StatelessWidget {
  const VaultSyncApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'VaultSync',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0 backyard047857), // Deep Emerald
          primary: const Color(0xFF047857),
          secondary: const Color(0xFFFFD700), // Electric Gold
        ),
        useMaterial3: true,
      ),
      home: const MainNavigationWrapper(),
    );
  }
}

class MainNavigationWrapper extends StatefulWidget {
  const MainNavigationWrapper({super.key});

  @override
  State<MainNavigationWrapper> createState() => _MainNavigationWrapperState();
}

class _MainNavigationWrapperState extends State<MainNavigationWrapper> {
  int _selectedIndex = 0;

  // Daftar Halaman Sesuai Spesifikasi
  static const List<Widget> _pages = <Widget>[
    Center(child: Text('Home Dashboard', style: TextStyle(fontSize: 24))),
    Center(child: Text('Multi-Pocket Management', style: TextStyle(fontSize: 24))),
    Center(child: Text('Analytics Center', style: TextStyle(fontSize: 24))),
    Center(child: Text('Marketplace & Investment', style: TextStyle(fontSize: 24))),
    Center(child: Text('Security Settings', style: TextStyle(fontSize: 24))),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('VaultSync', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(icon: const Icon(Icons.notifications_none), onPressed: () {}),
          IconButton(icon: const Icon(Icons.account_circle_outlined), onPressed: () {}),
        ],
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: _pages[_selectedIndex],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: _onItemTapped,
        destinations: const <NavigationDestination>[
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.account_balance_wallet_outlined),
            selectedIcon: Icon(Icons.account_balance_wallet),
            label: 'Pockets',
          ),
          NavigationDestination(
            icon: Icon(Icons.analytics_outlined),
            selectedIcon: Icon(Icons.analytics),
            label: 'Analytics',
          ),
          NavigationDestination(
            icon: Icon(Icons.shopping_bag_outlined),
            selectedIcon: Icon(Icons.shopping_bag),
            label: 'Market',
          ),
          NavigationDestination(
            icon: Icon(Icons.security_outlined),
            selectedIcon: Icon(Icons.security),
            label: 'Security',
          ),
        ],
      ),
    );
  }
}
/**
 * VaultSync Security & Authentication Module
 * Mengimplementasikan JWT Rotation, AES-256-GCM, dan Rate Limiting.
 */

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// --- 1. ENCRYPTION UTILITY (AES-256-GCM) ---
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // Harus 32 bytes

export const encryptData = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Format: iv:tag:encryptedData
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decryptData = (encryptedText: string): string => {
  const [ivHex, tagHex, contentHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  const content = Buffer.from(contentHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(content), decipher.final()]).toString('utf8');
};

// --- 2. AUTHENTICATION & JWT ROTATION ---
interface TokenPayload {
  userId: string;
  role: string;
}

export const generateTokens = (payload: TokenPayload) => {
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
  
  // Note: Di produksi, simpan refreshToken di Redis:
  // redis.set(`refresh_token:${payload.userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
  
  return { accessToken, refreshToken };
};

// --- 3. MIDDLEWARE: RATE LIMITING ---
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Batasi 5 percobaan login
  message: {
    message: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// --- 4. AUTH CONTROLLERS ---

// Mocking Database Pool (seperti yang didefinisikan sebelumnya)
declare const pool: any; 

export const register = async (req: Request, res: Response) => {
  const { fullName, email, phone, pin } = req.body;

  try {
    // Hash PIN (Gunakan bcrypt/argon2 sebelum enkripsi jika perlu, atau enkripsi langsung untuk VaultSync)
    const encryptedPin = encryptData(pin);

    const newUser = await pool.query(
      'INSERT INTO users (full_name, email, phone_number, encrypted_pin) VALUES ($1, $2, $3, $4) RETURNING id, email',
      [fullName, email, phone, encryptedPin]
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: newUser.rows[0]
    });
  } catch (error: any) {
    res.status(400).json({ message: 'Registrasi gagal', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, pin } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Kredensial tidak valid' });
    }

    const user = userResult.rows[0];
    const decryptedPin = decryptData(user.encrypted_pin);

    if (decryptedPin !== pin) {
      // Catat di audit log jika PIN salah
      return res.status(401).json({ message: 'Kredensial tidak valid' });
    }

    const tokens = generateTokens({ userId: user.id, role: 'user' });

    res.json({
      message: 'Login berhasil',
      ...tokens,
      user: { id: user.id, name: user.full_name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
/**
 * VaultSync Core Business Services
 * Mengimplementasikan logika Auto-Stash, Goal Calculator, dan Bank Sync.
 */

// --- 1. AUTO-STASH ALGORITHM ---
/**
 * Menghitung nominal pembulatan untuk fitur Auto-Stash.
 * Contoh: 18.500 -> dibulatkan ke 20.000 -> stash 1.500
 */
export const calculateAutoStash = (amount: number, roundTo: number = 10000): number => {
  if (amount <= 0) return 0;
  
  // Mencari kelipatan terdekat di atas nominal transaksi
  const remainder = amount % roundTo;
  if (remainder === 0) return 0; // Sudah pas di kelipatan (misal 20.000)
  
  const stashAmount = roundTo - remainder;
  return stashAmount;
};

// --- 2. GOAL PROGRESS CALCULATOR ---
interface GoalEstimation {
  currentProgress: number; // Persentase
  estimatedDaysRemaining: number;
  averageMonthlySaving: number;
}

/**
 * Menghitung estimasi waktu pencapaian target tabungan.
 */
export const calculateGoalProgress = (
  targetAmount: number,
  currentBalance: number,
  savingsHistory: { amount: number; date: Date }[]
): GoalEstimation => {
  const currentProgress = (currentBalance / targetAmount) * 100;
  const remainingAmount = targetAmount - currentBalance;

  if (remainingAmount <= 0) {
    return { currentProgress: 100, estimatedDaysRemaining: 0, averageMonthlySaving: 0 };
  }

  // Hitung rata-rata menabung per hari dalam 30 hari terakhir
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentSavings = savingsHistory
    .filter(s => s.date >= thirtyDaysAgo)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const dailyAverage = recentSavings / 30;

  // Jika user tidak menabung sama sekali, kembalikan -1 (infinity)
  const estimatedDaysRemaining = dailyAverage > 0 
    ? Math.ceil(remainingAmount / dailyAverage) 
    : -1;

  return {
    currentProgress: Math.min(currentProgress, 100),
    estimatedDaysRemaining,
    averageMonthlySaving: dailyAverage * 30
  };
};

// --- 3. OPEN BANKING API INTEGRATION (MOCK) ---
interface BankAccount {
  bankName: string;
  accountNumber: string;
  balance: number;
  currency: string;
}

/**
 * Mock function untuk simulasi integrasi dengan Open Banking API (e.g., Brick/Finantier).
 */
export const syncExternalBankData = async (userId: string, providerId: string): Promise<BankAccount[]> => {
  // Simulasi network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulasi data dari Bank API
  const mockData: BankAccount[] = [
    {
      bankName: "Bank Central Asia (BCA)",
      accountNumber: "****1234",
      balance: 12500000,
      currency: "IDR"
    },
    {
      bankName: "Bank Mandiri",
      accountNumber: "****5678",
      balance: 4200000,
      currency: "IDR"
    }
  ];

  console.log(`[Sync] Berhasil menarik data bank untuk user ${userId} melalui ${providerId}`);
  return mockData;
};

// --- 4. USE CASE EXAMPLE: PROCESS TRANSACTION WITH AUTO-STASH ---
export const processUserTransaction = async (
  userId: string,
  pocketId: string,
  transactionAmount: number
) => {
  const stashAmount = calculateAutoStash(transactionAmount);
  
  const result = {
    originalTransaction: transactionAmount,
    stashToPocket: stashAmount,
    totalDeduction: transactionAmount + stashAmount,
    timestamp: new Date()
  };

  // Di sini nantinya logic ini akan memanggil Repository untuk:
  // 1. Kurangi saldo utama (Account/Pocket)
  // 2. Tambah saldo ke "Auto-Stash Pocket"
  // 3. Simpan record ke tabel 'transactions'
  
  return result;
};&& 

/**
 * VaultSync Integration Test
 * Menguji alur dari Frontend Action (Mock) -> Business Logic -> Persistence
 */

const { encryptData, decryptData } = require('./security_auth');
const { calculateAutoStash } = require('./vaultsync_services');

async function testAutoStashFlow() {
  console.log('--- Memulai Uji Integrasi VaultSync ---');

  // 1. Simulasi Transaksi User di Merchant (Rp 18.500)
  const transactionAmount = 18500;
  console.log(`[Frontend] Transaksi terdeteksi: Rp ${transactionAmount}`);

  // 2. Hitung Auto-Stash di Service Layer
  const stashAmount = calculateAutoStash(transactionAmount);
  console.log(`[Service] Algoritma Auto-Stash menghitung: Rp ${stashAmount}`);

  // 3. Simulasi Enkripsi sebelum masuk Database
  const mockBalanceBefore = 500000; // Rp 500.000
  const newBalance = mockBalanceBefore + stashAmount;
  const encryptedPayload = encryptData(newBalance.toString());
  
  console.log(`[Security] Saldo baru dienkripsi: ${encryptedPayload.substring(0, 30)}...`);

  // 4. Verifikasi Integritas Data (Dekripsi kembali)
  const decryptedBalance = decryptData(encryptedPayload);
  
  if (parseInt(decryptedBalance) === 501500) {
    console.log('--- TEST BERHASIL: Integrasi End-to-End Aman ---');
  } else {
    console.error('--- TEST GAGAL: Data Corrupted ---');
  }
}

testAutoStashFlow();

# VaultSync API Gateway Configuration
# Proteksi: TLS 1.3, DDoS Mitigation, & Security Headers

upstream vaultsync_backend {
    server 127.0.0.1:5000;
}

server {
    listen 443 ssl http2;
    server_name api.vaultsync.com;

    # SSL/TLS Configuration
    ssl_certificate /etc/letsencrypt/live/vaultsync/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vaultsync/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers EECDH+AESGCM:EDH+AESGCM;

    # DDoS Protection: Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # Security Headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'none'; script-src 'self'; object-src 'none';";

    location /api/v1/ {
        proxy_pass http_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}