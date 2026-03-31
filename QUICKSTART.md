# 🚀 Quick Start Guide

## ⚡ 30-Second Setup

### Step 1: Open Two Terminal Windows

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm start
```

That's it! The app will open automatically at `http://localhost:3000`

---

## 📖 What You Can Do

### 1. **Home Page**
- View all available algorithms
- Click "Explore Algorithm" to dive into Caesar Cipher

### 2. **Caesar Cipher Page - 4 Tabs**

#### 📚 Information Tab
- Learn how Caesar Cipher works
- Understand encryption/decryption process
- See real examples
- Learn about brute force vulnerability

#### 🔒 Encrypt Tab
- Enter any text
- Choose shift key (0-25) using slider or number input
- See encrypted result instantly
- Copy encrypted text

#### 🔓 Decrypt Tab
- Paste encrypted text
- Enter the correct shift key
- Get decrypted plaintext
- Copy result

#### 💥 Brute Force Tab
- Paste encrypted text WITHOUT knowing the key
- Algorithm tries all 26 possible keys
- Sees all decryption attempts
- AI identifies most likely plaintext based on:
  - English word frequency
  - Vowel/consonant ratio
  - Letter distribution

---

## 🔍 Example Walkthrough

### Example 1: Simple Encryption
1. Go to **Encrypt** tab
2. Type: `HELLO WORLD`
3. Set shift to: `5`
4. Result: `MJQQT BTWQI`

### Example 2: Decrypt with Key
1. Go to **Decrypt** tab
2. Paste: `MJQQT BTWQI`
3. Enter shift: `5`
4. Result: `HELLO WORLD`

### Example 3: Brute Force Attack
1. Go to **Brute Force** tab
2. Paste: `MJQQT BTWQI`
3. Click "Start Brute Force Attack"
4. See all 26 attempts
5. Key 5 shows "HELLO WORLD" as Best Match ✓

---

## 🛠️ Backend API

If you want to test the API directly:

### Encrypt
```bash
curl -X POST http://localhost:5000/api/caesar/encrypt \
  -H "Content-Type: application/json" \
  -d '{"plaintext":"HELLO","shift":3}'
```

### Decrypt
```bash
curl -X POST http://localhost:5000/api/caesar/decrypt \
  -H "Content-Type: application/json" \
  -d '{"ciphertext":"KHOOR","shift":3}'
```

### Brute Force
```bash
curl -X POST http://localhost:5000/api/caesar/bruteforce \
  -H "Content-Type: application/json" \
  -d '{"ciphertext":"KHOOR"}'
```

### Algorithm Info
```bash
curl http://localhost:5000/api/caesar/info
```

---

## ❓ Troubleshooting

### Port Already in Use
If port 5000 is busy, edit `.env`:
```
PORT=5001
```

### React Won't Load
- Make sure backend is running (`npm start` in server folder)
- Check browser console (F12) for errors
- Try `npm start` again in client folder

### Dependencies Issue
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📁 Important Files

- **Backend Logic:** `server/algorithms/caesarCipher.js`
- **API Routes:** `server/routes/caesarCipherRoutes.js`
- **Main Page:** `client/src/pages/CaesarCipherPage.js`
- **Documentation:** `/README.md`

---

## 🎓 Learning Tips

1. **Start with Information Tab** - Understand the algorithm first
2. **Try Encryption** - Encrypt your own messages
3. **Practice Decryption** - Decrypt with known keys
4. **Use Brute Force** - See why this cipher is weak
5. **Read Comments** - Code is well-documented

---

## 🚀 Next Steps

- Add more algorithms
- Improve brute force detection
- Add frequency analysis visualization
- Create algorithm comparison tool
- Add difficulty levels

---

Happy Learning! 🎉
