# ⚡ Quick Start - NPM_TOKEN Setup

**Tid:** 2 minutter  
**Vanskelighetsgrad:** ⭐ Enkel

---

## 🎯 Hva skal gjøres?

Sett opp NPM_TOKEN i GitHub Secrets slik at GitHub Actions kan publisere til npm automatisk.

---

## 📋 3 Enkle Steg

### **1. Hent npm Token** (1 minutt)

1. Gå til: **https://www.npmjs.com/settings/catohansen/tokens**
2. Klikk **"Generate New Token"**
3. Velg **"Automation"**
4. Klikk **"Generate Token"**
5. **Kopier tokenet** (viktig: du ser det bare én gang!)

---

### **2. Legg til i GitHub** (30 sekunder)

1. Gå til: **https://github.com/catohansen/notifyplan-core/settings/secrets/actions**
2. Klikk **"New repository secret"**
3. **Name:** `NPM_TOKEN`
4. **Secret:** Lim inn tokenet
5. Klikk **"Add secret"**

---

### **3. Trigger Publishing** (30 sekunder)

**Alternativ A: Automatisk**
- GitHub Actions vil automatisk publisere når tag er pushet
- Sjekk: https://github.com/catohansen/notifyplan-core/actions

**Alternativ B: Push tag på nytt**
```bash
cd "/Users/catohansen/Dev/NotifyPlan 2.0/notifyplan-core"
git push origin v2.0.0 --force
```

---

## ✅ Verifisering

Etter 2-3 minutter, sjekk:

```bash
npm view @notifyplan/core
```

Du skal se versjon 2.0.0!

---

## 🔗 Quick Links

- **npm Tokens:** https://www.npmjs.com/settings/catohansen/tokens
- **GitHub Secrets:** https://github.com/catohansen/notifyplan-core/settings/secrets/actions
- **GitHub Actions:** https://github.com/catohansen/notifyplan-core/actions

---

**Det er alt! 🎉**

