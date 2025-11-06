# 🚀 Quick Setup - NPM Token (2 minutter)

## Automatisk Setup (Anbefalt)

Kjør dette scriptet:

```bash
cd "/Users/catohansen/Dev/NotifyPlan 2.0/notifyplan-core"
./setup-npm-token.sh
```

Scriptet vil:
1. ✅ Åpne npm tokens side
2. ✅ Guide deg gjennom prosessen
3. ✅ Hjelpe deg med å sette tokenet (via GitHub CLI hvis mulig)

---

## Manuell Setup (Hvis scriptet ikke fungerer)

### Steg 1: Hent npm Token

1. Gå til: https://www.npmjs.com/settings/catohansen/tokens
2. Klikk **"Generate New Token"**
3. Velg **"Automation"** type
4. **Kopier tokenet** (starter med `npm_...`)

### Steg 2: Legg til i GitHub Secrets

1. Gå til: https://github.com/catohansen/notifyplan-core/settings/secrets/actions
2. Klikk **"New repository secret"**
3. **Name:** `NPM_TOKEN`
4. **Secret:** Lim inn tokenet du kopierte
5. Klikk **"Add secret"**

### Steg 3: Verifiser

Sjekk at NPM_TOKEN er satt:
```bash
gh secret list --repo catohansen/notifyplan-core
```

Du skal se `NPM_TOKEN` i listen.

---

## ✅ Ferdig!

Når NPM_TOKEN er satt, vil GitHub Actions automatisk publisere til npm når du pusher en tag.

**Test det:**
```bash
cd "/Users/catohansen/Dev/NotifyPlan 2.0/notifyplan-core"
git tag -d v2.0.0 2>/dev/null || true
git tag v2.0.0
git push origin v2.0.0 --force
```

Sjekk status: https://github.com/catohansen/notifyplan-core/actions

---

**Utviklet med ❤️ av Cato Hansen**

