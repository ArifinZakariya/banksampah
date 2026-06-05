-- ============================================
-- BANK SAMPAH - Supabase SQL Setup
-- Safe version: drop if exists, lalu buat ulang
-- ============================================

-- Drop existing
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
DROP TRIGGER IF EXISTS trigger_sampah_updated_at ON sampah;
DROP TRIGGER IF EXISTS trigger_transaksi_updated_at ON transaksi;
DROP TRIGGER IF EXISTS trigger_tabungan_updated_at ON tabungan;
DROP TRIGGER IF EXISTS trigger_pencairan_updated_at ON pencairan;
DROP FUNCTION IF EXISTS update_updated_at();
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS pencairan CASCADE;
DROP TABLE IF EXISTS transaksi CASCADE;
DROP TABLE IF EXISTS tabungan CASCADE;
DROP TABLE IF EXISTS sampah CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS "StatusPencairan" CASCADE;
DROP TYPE IF EXISTS "StatusTransaksi" CASCADE;
DROP TYPE IF EXISTS "Role" CASCADE;

-- 1. Enum Types
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ANGGOTA');
CREATE TYPE "StatusTransaksi" AS ENUM ('PENDING', 'DIKONFIRMASI', 'DITOLAK');
CREATE TYPE "StatusPencairan" AS ENUM ('MENUNGGU', 'DISETUJUI', 'DITOLAK');

-- 2. Tabel Users
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nama TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role "Role" DEFAULT 'ANGGOTA',
  foto TEXT,
  alamat TEXT,
  "noTelpon" TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Sampah
CREATE TABLE sampah (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nama TEXT NOT NULL,
  harga_per_kg FLOAT NOT NULL,
  satuan TEXT DEFAULT 'kg',
  deskripsi TEXT,
  foto TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel Transaksi
CREATE TABLE transaksi (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sampah_id TEXT NOT NULL REFERENCES sampah(id) ON DELETE CASCADE,
  berat_kg FLOAT NOT NULL,
  total_harga FLOAT NOT NULL,
  status "StatusTransaksi" DEFAULT 'PENDING',
  foto TEXT,
  catatan TEXT,
  verified_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabel Tabungan
CREATE TABLE tabungan (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  saldo FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabel Pencairan
CREATE TABLE pencairan (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  jumlah FLOAT NOT NULL,
  status "StatusPencairan" DEFAULT 'MENUNGGU',
  tanggal_pencairan TIMESTAMPTZ,
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Tabel Logs
CREATE TABLE logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  aksi TEXT NOT NULL,
  detail TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Indexes
CREATE INDEX idx_transaksi_user_id ON transaksi(user_id);
CREATE INDEX idx_transaksi_sampah_id ON transaksi(sampah_id);
CREATE INDEX idx_transaksi_status ON transaksi(status);
CREATE INDEX idx_tabungan_user_id ON tabungan(user_id);
CREATE INDEX idx_pencairan_user_id ON pencairan(user_id);
CREATE INDEX idx_pencairan_status ON pencairan(status);
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_users_email ON users(email);

-- 9. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_sampah_updated_at BEFORE UPDATE ON sampah FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_transaksi_updated_at BEFORE UPDATE ON transaksi FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_tabungan_updated_at BEFORE UPDATE ON tabungan FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trigger_pencairan_updated_at BEFORE UPDATE ON pencairan FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 10. RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sampah ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tabungan ENABLE ROW LEVEL SECURITY;
ALTER TABLE pencairan ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON sampah FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON transaksi FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tabungan FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON pencairan FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON logs FOR ALL USING (true) WITH CHECK (true);
