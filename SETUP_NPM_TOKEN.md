# 🔑 Sett opp NPM_TOKEN - Steg-for-steg Guide

**Dato:** 2025-01-21  
**Tid:** 2 minutter

---

## 🎯 Hva skal gjøres

Sett opp NPM_TOKEN i GitHub Secrets slik at GitHub Actions kan publisere til npm automatisk.

---

## 📋 Steg-for-steg

### **Steg 1: Hent npm Token**

1. **Gå til npm Settings:**
   https://www.npmjs.com/settings/catohansen/tokens

2. **Klikk "Generate New Token"**

3. **Velg token type:**
   - **Automation** (anbefalt - full access)
   - Eller **Granular** hvis du vil ha mer kontroll

4. **Klikk "Generate Token"**

5. **Kopier token** (viktig: du ser den bare én gang!)

---

### **Steg 2: Legg til i GitHub Secrets**

1. **Gå til GitHub Secrets:**
   https://github.com/catohansen/notifyplan-core/settings/secrets/actions

2. **Klikk "New repository secret"**

3. **Fyll ut:**
   - **Name:** `NPM_TOKEN`
   - **Secret:** Lim inn tokenet du kopierte fra npm

4. **Klikk "Add secret"**

---

### **Steg 3: Trigger Publishing**

**Etter NPM_TOKEN er satt, kan du:**

**Alternativ A: Vent på neste tag push**
- Neste gang du pusher en tag, publiseres automatisk

**Alternativ B: Push tag på nytt (anbefalt)**
```bash
cd "/Users/catohansen/Dev/NotifyPlan 2.0/notifyplan-core"
git push origin v2.0.0 --force
```

**Alternativ C: Sjekk GitHub Actions**
- Gå til: https://github.com/catohansen/notifyplan-core/actions
- Se om workflow kjører automatisk

---

## ✅ Verifisering

Etter publishing, sjekk:

```bash
# Sjekk at pakken er publisert
npm view @notifyplan/core

# Sjekk versjon
npm view @notifyplan/core version

# Sjekk at den kan installeres
npm install @notifyplan/core@latest --dry-run
```

---

## 🔗 Viktige Links

- **GitHub Secrets:** https://github.com/catohansen/notifyplan-core/settings/secrets/actions
- **npm Tokens:** https://www.npmjs.com/settings/catohansen/tokens
- **GitHub Actions:** https://github.com/catohansen/notifyplan-core/actions
- **npm Package:** https://www.npmjs.com/package/@notifyplan/core

---

## 🐛 Troubleshooting

### **Token fungerer ikke:**
- Sjekk at token er "Automation" type
- Sjekk at token ikke er utløpt
- Sjekk at token er kopiert korrekt (uten mellomrom)

### **GitHub Actions feiler:**
- Sjekk at NPM_TOKEN er satt korrekt
- Sjekk GitHub Actions logs
- Prøv å push tag på nytt

### **Pakken publiseres ikke:**
- Sjekk at tag er pushet: `git tag -l`
- Sjekk GitHub Actions: https://github.com/catohansen/notifyplan-core/actions
- Sjekk at workflow filen er korrekt

---

## 🎉 Når Alt Er Ferdig

Etter npm publishing:

1. **Installer i NotifyPlan SaaS:**
   ```bash
   cd "/Users/catohansen/Dev/NotifyPlan 2.0/notifyplan-online"
   npm install @notifyplan/core@latest
   ```

2. **Installer i Pengeplan 2.0:**
   ```bash
   cd "/Users/catohansen/Dev/Pengeplan2-projeckt/pengeplan-online"
   npm install @notifyplan/core@latest
   ```

3. **Installer i Nora AI 2.0:**
   ```bash
   cd "/Users/catohansen/Dev/nora-project/nora-online"
   npm install @notifyplan/core@latest
   ```

---

**Utviklet med ❤️ av Cato Hansen**  
**Copyright © 2025 Cato Hansen. All rights reserved.**

