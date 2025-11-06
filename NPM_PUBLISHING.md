# 📦 npm Publishing Guide

**Dato:** 2025-01-21  
**Status:** 🟡 Ventende på NPM_TOKEN

---

## ✅ Hva er gjort

1. ✅ Git tag v2.0.0 opprettet
2. ✅ Tag pushet til GitHub
3. ✅ GitHub Actions workflow klar

---

## 🔧 NPM_TOKEN Setup (Kreves)

GitHub Actions trenger NPM_TOKEN for å publisere automatisk.

### **Steg-for-steg:**

1. **Gå til GitHub Secrets:**
   https://github.com/catohansen/notifyplan-core/settings/secrets/actions

2. **Klikk "New repository secret"**

3. **Fyll ut:**
   - **Name:** `NPM_TOKEN`
   - **Secret:** Hent fra https://www.npmjs.com/settings/catohansen/tokens

4. **Hvordan få NPM_TOKEN:**
   - Gå til: https://www.npmjs.com/settings/catohansen/tokens
   - Klikk "Generate New Token"
   - Velg "Automation" (full access)
   - Kopier token
   - Lim inn i GitHub Secrets

5. **Etter NPM_TOKEN er satt:**
   - GitHub Actions vil automatisk publisere når tag pushet
   - Eller push tag på nytt: `git push origin v2.0.0`

---

## 🔄 Alternativ: Manuell Publishing

Hvis du vil publisere manuelt i stedet:

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

## ✅ Verifisering

Etter publishing, sjekk:

```bash
# Sjekk at pakken er publisert
npm view @notifyplan/core

# Sjekk versjon
npm view @notifyplan/core version
```

---

## 🔗 Links

- **GitHub Secrets:** https://github.com/catohansen/notifyplan-core/settings/secrets/actions
- **npm Tokens:** https://www.npmjs.com/settings/catohansen/tokens
- **GitHub Actions:** https://github.com/catohansen/notifyplan-core/actions
- **npm Package:** https://www.npmjs.com/package/@notifyplan/core

---

**Utviklet med ❤️ av Cato Hansen**  
**Copyright © 2025 Cato Hansen. All rights reserved.**

