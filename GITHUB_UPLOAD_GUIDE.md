# 📤 Panduan Upload Project ke GitHub

## 🚀 Cara Upload ke GitHub

### Method 1: Via GitHub Desktop (Paling Mudah)

1. **Download GitHub Desktop:**
   - https://desktop.github.com/
   - Install dan login dengan akun GitHub

2. **Create Repository di GitHub:**
   - Buka https://github.com
   - Klik "New repository"
   - Isi nama repository (misalnya: `tubes-iae-microservices`)
   - Pilih Public atau Private
   - Jangan centang "Initialize with README"
   - Klik "Create repository"

3. **Clone Repository:**
   - Di GitHub Desktop, klik "File" → "Clone repository"
   - Pilih repository yang baru dibuat
   - Pilih lokasi folder
   - Klik "Clone"

4. **Copy Files:**
   - Copy semua file project ke folder repository yang sudah di-clone
   - Pastikan `.gitignore` sudah ada

5. **Commit & Push:**
   - Di GitHub Desktop, semua file akan muncul
   - Isi commit message: "Initial commit - E-Commerce Microservices"
   - Klik "Commit to main"
   - Klik "Push origin"

---

### Method 2: Via Git Command Line

#### Step 1: Install Git
- Download: https://git-scm.com/download/win
- Install dengan default settings

#### Step 2: Initialize Git Repository

```bash
# Buka terminal di folder project
cd "C:\Users\Raihan Tri Darma\Documents\SEMESTER 5\NTEGRASI APLIKASI ENTERPRISE\TUBES IAE"

# Initialize git
git init

# Add semua file
git add .

# Commit pertama
git commit -m "Initial commit - E-Commerce Microservices Project"
```

#### Step 3: Create Repository di GitHub

1. Buka https://github.com
2. Klik "New repository" (tombol + di kanan atas)
3. Isi:
   - **Repository name:** `tubes-iae-microservices` (atau nama lain)
   - **Description:** "E-Commerce Microservices dengan GraphQL dan Docker"
   - **Visibility:** Public atau Private
   - Jangan centang "Initialize with README"
4. Klik "Create repository"

#### Step 4: Connect & Push ke GitHub

```bash
# Add remote repository (ganti USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Atau jika menggunakan SSH
# git remote add origin git@github.com:USERNAME/REPO_NAME.git

# Rename branch ke main (jika perlu)
git branch -M main

# Push ke GitHub
git push -u origin main
```

**Note:** GitHub akan meminta login. Ikuti instruksi di terminal.

---

### Method 3: Via VS Code (Termudah untuk Developer)

1. **Install Git:**
   - Download: https://git-scm.com/download/win

2. **Install GitHub Extension di VS Code:**
   - Buka VS Code
   - Extensions → Cari "GitHub"
   - Install "GitHub" extension

3. **Login GitHub di VS Code:**
   - Tekan `Ctrl+Shift+P`
   - Ketik "Git: Clone"
   - Atau buat repository baru via GitHub website

4. **Initialize Repository:**
   - Buka folder project di VS Code
   - Klik icon Source Control (Ctrl+Shift+G)
   - Klik "Initialize Repository"
   - Add semua file
   - Commit dengan message
   - Push ke GitHub

---

## 📋 Checklist Sebelum Upload

### ✅ File yang Harus Ada
- [x] README.md
- [x] docker-compose.yml
- [x] init-db.sql
- [x] run.bat / run.sh
- [x] Semua Dockerfile
- [x] Semua package.json
- [x] Semua source code (.js, .ejs, .css)
- [x] .gitignore

### ❌ File yang TIDAK Perlu Upload
- [ ] node_modules/ (akan di-ignore)
- [ ] .env files (akan di-ignore)
- [ ] Log files (akan di-ignore)
- [ ] Database files (akan di-ignore)

---

## 🔧 Setup Git (Pertama Kali)

Jika belum pernah setup Git:

```bash
# Set username
git config --global user.name "Raihan Tri Darma"

# Set email
git config --global user.email "your-email@example.com"

# Check config
git config --list
```

---

## 📝 Git Commands yang Sering Digunakan

```bash
# Check status
git status

# Add semua file
git add .

# Add file tertentu
git add README.md

# Commit perubahan
git commit -m "Update: penjelasan commit"

# Push ke GitHub
git push

# Pull dari GitHub
git pull

# Check remote
git remote -v

# View history
git log
```

---

## 🎯 Quick Upload Steps (Summary)

1. **Install Git** → https://git-scm.com/download/win
2. **Create Repository** → https://github.com/new
3. **Initialize & Push:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```

---

## ⚠️ Important Notes

1. **Jangan upload:**
   - node_modules/ (terlalu besar, bisa regenerate)
   - .env files (berisi credentials)
   - Database files (terlalu besar)

2. **File penting yang harus ada:**
   - package.json (untuk install dependencies)
   - Dockerfile (untuk build image)
   - Source code semua service

3. **Size limit GitHub:**
   - Free account: 100MB per file
   - Repository: Tidak ada limit (tapi jangan upload node_modules)

---

## 🆘 Troubleshooting

### Error: "Repository not found"
- Pastikan repository sudah dibuat di GitHub
- Check URL remote: `git remote -v`
- Pastikan sudah login: `git config --global user.name`

### Error: "Permission denied"
- Pastikan sudah login GitHub
- Check SSH keys atau gunakan HTTPS dengan token

### File terlalu besar
- Pastikan .gitignore sudah benar
- Hapus node_modules dari tracking:
  ```bash
  git rm -r --cached node_modules
  git commit -m "Remove node_modules"
  ```

---

**Selamat upload! 🎉**

