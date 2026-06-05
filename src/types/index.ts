export interface User {
  id: string;
  nama: string;
  email: string;
  role: string;
  foto?: string | null;
  alamat?: string | null;
  noTelpon?: string | null;
  createdAt: string;
}

export interface Sampah {
  id: string;
  nama: string;
  hargaPerKg: number;
  satuan: string;
  deskripsi?: string | null;
  foto?: string | null;
  createdAt: string;
}

export interface Transaksi {
  id: string;
  userId: string;
  sampahId: string;
  beratKg: number;
  totalHarga: number;
  status: "PENDING" | "DIKONFIRMASI" | "DITOLAK";
  foto?: string | null;
  catatan?: string | null;
  verifiedBy?: string | null;
  user?: { nama: string };
  sampah?: { nama: string };
  createdAt: string;
}

export interface Tabungan {
  id: string;
  userId: string;
  saldo: number;
}

export interface Pencairan {
  id: string;
  userId: string;
  jumlah: number;
  status: "MENUNGGU" | "DISETUJUI" | "DITOLAK";
  tanggalPencairan?: string | null;
  catatan?: string | null;
  user?: { nama: string };
  createdAt: string;
}

export interface Log {
  id: string;
  userId: string;
  aksi: string;
  detail?: string | null;
  user?: { nama: string };
  createdAt: string;
}
