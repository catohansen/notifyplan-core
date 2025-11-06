# 🚀 NotifyPlan Core - Deployment Guide

**Dato:** 2025-01-21  
**Status:** ✅ Ready for Deployment

---

## 📋 Steg-for-steg Deployment

### **1. Push til GitHub**

```bash
cd "/Users/catohansen/Dev/NotifyPlan 2.0/notifyplan-core"

# Sjekk status
git status

# Legg til alle filer (hvis ikke allerede gjort)
git add -A

# Commit (hvis ikke allerede gjort)
git commit -m "🎉 Initial commit - NotifyPlan Core Open Source (MIT)"

# Push til GitHub
git push -u origin main
```

**Note:** Hvis du får autentiseringsfeil:
- Bruk SSH: `git remote set-url origin git@github.com:catohansen/notifyplan-core.git`
- Eller autentiser med GitHub CLI: `gh auth login`

---

### **2. Sett opp NPM_TOKEN i GitHub Secrets**

1. Gå til: https://github.com/catohansen/notifyplan-core/settings/secrets/actions
2. Klikk "New repository secret"
3. Navn: `NPM_TOKEN`
4. Verdi: Din npm access token (se nedenfor)

**Hvordan få NPM_TOKEN:**
```bash
# Logg inn på npm
npm login

# Opprett access token
npm token create --read-only=false
# Eller gå til: https://www.npmjs.com/settings/catohansen/tokens
```

---

### **3. Publiser til npm**

#### **Metode 1: Automatisk via GitHub Actions (Anbefalt)**

1. **Push en tag:**
   ```bash
   cd "/Users/catohansen/Dev/NotifyPlan 2.0/notifyplan-core"
   git tag v2.0.0
   git push origin v2.0.0
   ```

2. **GitHub Actions vil automatisk:**
   - Bygge pakken
   - Publisere til npm
   - Sjekk Actions: https://github.com/catohansen/notifyplan-core/actions

#### **Metode 2: Manuell publishing**

```bash
cd "/Users/catohansen/Dev/NotifyPlan 2.0/notifyplan-core"

# Logg inn på npm
npm login

# Bygg pakken
npm run build

# Publiser
npm publish --access public
```

---

### **4. Oppdater NotifyPlan SaaS**

```bash
cd "/Users/catohansen/Dev/NotifyPlan 2.0/notifyplan-online"

# Fjern lokal pakke (hvis den eksisterer)
rm -rf packages/notifyplan-core

# Installer fra npm
npm install @notifyplan/core@latest

# Verifiser installasjon
npm list @notifyplan/core
```

**Imports er allerede oppdatert til å bruke `@notifyplan/core`!** ✅

---

### **5. Test Funksjonalitet**

```bash
cd "/Users/catohansen/Dev/NotifyPlan 2.0/notifyplan-online"

# Bygg prosjektet
npm run build

# Start dev server
npm run dev

# Test API endpoint
curl http://localhost:3000/api/v1/notifications
```

**Sjekk:**
- ✅ Imports fungerer
- ✅ API endpoints responderer
- ✅ Ingen TypeScript errors
- ✅ Build fungerer

---

### **6. Verifiser Admin Paneler**

#### **Pengeplan 2.0:**
1. Gå til: `/admin/super/business-partners`
2. Verifiser at NotifyPlan 2.0, Nora AI 2.0, og NotifyPlan Core vises
3. Sjekk at versjoner er korrekte
4. Test "Sjekk oppdateringer" knapp

#### **NotifyPlan 2.0:**
1. Gå til: `/admin/owner`
2. Verifiser eier-informasjon
3. Sjekk at alle prosjekter vises
4. Verifiser business model info

#### **Nora AI 2.0:**
1. Gå til: `/admin/owner`
2. Verifiser eier-informasjon
3. Sjekk at alle prosjekter vises
4. Verifiser business model info

---

## ✅ Checklist

- [ ] Push til GitHub
- [ ] Sett opp NPM_TOKEN i GitHub Secrets
- [ ] Publiser til npm (via tag eller manuelt)
- [ ] Oppdater NotifyPlan SaaS til å bruke npm-pakken
- [ ] Test funksjonalitet
- [ ] Verifiser admin paneler
- [ ] Oppdater Pengeplan 2.0 til å bruke npm-pakken (når klar)

---

## 🔗 Links

- **GitHub Repo:** https://github.com/catohansen/notifyplan-core
- **npm Package:** https://www.npmjs.com/package/@notifyplan/core
- **GitHub Actions:** https://github.com/catohansen/notifyplan-core/actions
- **npm Tokens:** https://www.npmjs.com/settings/catohansen/tokens

---

## 🐛 Troubleshooting

### **Git Push Feiler:**
```bash
# Bruk SSH i stedet
git remote set-url origin git@github.com:catohansen/notifyplan-core.git
git push -u origin main
```

### **npm Publish Feiler:**
- Sjekk at du er logget inn: `npm whoami`
- Sjekk at pakkenavnet er tilgjengelig: `npm view @notifyplan/core`
- Sjekk at versjonen ikke allerede eksisterer

### **Imports Feiler:**
- Sjekk at pakken er installert: `npm list @notifyplan/core`
- Sjekk tsconfig.json paths
- Reinstall: `rm -rf node_modules package-lock.json && npm install`

---

**Utviklet med ❤️ av Cato Hansen**  
**Copyright © 2025 Cato Hansen. All rights reserved.**

