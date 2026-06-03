# Lokerku - Smart Locker Rental

Aplikasi penyewaan loker harian dengan fitur QR access, manajemen admin, dan pembayaran berbasis durasi.

## Tech Stack

- **Frontend**: React 19 + Vite 8 + Tailwind CSS 4
- **State Management**: Zustand + React Query
- **Routing**: React Router DOM 7
- **Charts**: Chart.js + react-chartjs-2
- **Export**: jsPDF + xlsx

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running (see be-lokerku)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Environment Variables

Copy `.env.example` to `.env` and set:

```
VITE_API_BASE_URL=https://your-backend-url.com
```

## Deployment (Vercel)

1. Push code to GitHub
2. Import repo on [Vercel](https://vercel.com/new)
3. Set environment variable: `VITE_API_BASE_URL` = your backend URL
4. Deploy!

`vercel.json` is already configured for SPA routing.

## Features

- 🔐 Login & Register dengan Remember Me
- 🏪 Cari loker berdasarkan kota/daerah
- 📱 QR Code akses loker
- 👤 Dashboard user & admin
- 📊 Laporan & chart okupansi
- 📥 Export data (PDF, XLSX, Image)
- ⚙️ Master data management (daerah, lokasi, ukuran, kategori)
- 👥 Manajemen user oleh admin
