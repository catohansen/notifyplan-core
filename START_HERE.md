# 🚀 START HER - NPM_TOKEN Setup

**Tid:** 2 minutter  
**Vanskelighetsgrad:** ⭐ Enkel

---

## ⚡ 3 Enkle Klikk

### **1️⃣ Hent npm Token**

👉 **Klikk her:** https://www.npmjs.com/settings/catohansen/tokens

1. Klikk **"Generate New Token"**
2. Velg **"Automation"**
3. Klikk **"Generate Token"**
4. **Kopier tokenet** (du ser det bare én gang!)

---

### **2️⃣ Legg til i GitHub**

👉 **Klikk her:** https://github.com/catohansen/notifyplan-core/settings/secrets/actions

1. Klikk **"New repository secret"**
2. **Name:** `NPM_TOKEN`
3. **Secret:** Lim inn tokenet du kopierte
4. Klikk **"Add secret"**

---

### **3️⃣ Ferdig! 🎉**

GitHub Actions publiserer automatisk til npm!

**Sjekk status:** https://github.com/catohansen/notifyplan-core/actions

Etter 2-3 minutter, test:
```bash
npm view @notifyplan/core
```

---

## ✅ Det er alt!

Etter dette kan alle tre prosjekter installere:
```bash
npm install @notifyplan/core@latest
```

---

**Utviklet med ❤️ av Cato Hansen**

