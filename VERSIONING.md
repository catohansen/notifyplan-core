# 📦 NotifyPlan Core - Versioning Guide

**Versjon:** 2.0.0  
**Sist oppdatert:** 2025-01-21

---

## 🎯 Semantisk Versjonering

NotifyPlan Core følger [Semantic Versioning (SemVer)](https://semver.org/) standarden:

**Format:** `MAJOR.MINOR.PATCH`

### **Versjonstyper:**

#### **MAJOR (2.x.x) - Breaking Changes**
- Inkompatible API-endringer
- Krever migrasjon
- Eksempel: `2.0.0` → `3.0.0`

**Hva betyr dette:**
- Eksisterende kode kan stoppe å fungere
- API-endringer som ikke er backward compatible
- Endringer i data-strukturer
- Fjernede funksjoner

**Hva du må gjøre:**
- Les migrasjonsguiden
- Oppdater koden din
- Test grundig før produksjon

---

#### **MINOR (x.1.x) - Nye Features**
- Nye funksjoner (backward compatible)
- Auto-update anbefalt
- Eksempel: `2.0.0` → `2.1.0`

**Hva betyr dette:**
- Nye features legges til
- Eksisterende funksjoner fungerer fortsatt
- Ingen breaking changes
- Kan oppdateres uten migrasjon

**Hva du må gjøre:**
- Sjekk changelog for nye features
- Oppdater pakken: `npm install @notifyplan/core@latest`
- Test nye features

---

#### **PATCH (x.x.1) - Bug Fixes**
- Bug fixes (backward compatible)
- Auto-update anbefalt
- Eksempel: `2.0.0` → `2.0.1`

**Hva betyr dette:**
- Feilrettinger
- Sikkerhetspatches
- Performance-forbedringer
- Ingen funksjonelle endringer

**Hva du må gjøre:**
- Oppdater umiddelbart: `npm install @notifyplan/core@latest`
- Test at alt fungerer
- Ingen kodeendringer nødvendig

---

## 🔄 Versjonskontroll API

### **Sjekk for oppdateringer:**

```typescript
// GET /api/v1/version?current=2.0.0
const response = await fetch('https://notifyplan.io/api/v1/version?current=2.0.0')
const versionInfo = await response.json()

if (versionInfo.updateAvailable) {
  if (versionInfo.breaking) {
    console.log('⚠️ Breaking change - read migration guide')
  } else {
    console.log('✅ Update available - safe to update')
  }
}
```

### **Response format:**

```json
{
  "current": "2.0.0",
  "latest": "2.1.0",
  "updateAvailable": true,
  "breaking": false,
  "compatibility": {
    "compatible": true,
    "requiresMigration": false,
    "migrationPath": [],
    "migrationGuide": "https://docs.notifyplan.io/migration/2.0-to-2.1"
  },
  "changelog": [...],
  "security": {
    "vulnerabilities": [],
    "patches": []
  }
}
```

---

## 🔧 Compatibility Layer

NotifyPlan Core inkluderer en **Compatibility Layer** som automatisk håndterer versjonsmigrasjoner:

```typescript
import { CompatibilityLayer } from '@notifyplan/core'

// Sjekk kompatibilitet
const compatibility = CompatibilityLayer.isCompatible('2.0.0', '2.1.0')
console.log(compatibility.compatible) // true

// Migrer payload mellom versjoner
const migrated = CompatibilityLayer.migratePayload(
  payload,
  '2.0.0',
  '2.1.0'
)
```

---

## 📋 Changelog

Alle endringer dokumenteres i [CHANGELOG.md](./CHANGELOG.md).

**Format:**
```markdown
## [2.1.0] - 2025-01-21

### Added
- Smart digest algorithm
- New workflow conditions

### Changed
- Improved performance

### Fixed
- Bug in email delivery
```

---

## 🚀 Oppdateringsstrategi

### **Automatisk oppdatering (anbefalt):**

```bash
# Oppdater til latest patch
npm install @notifyplan/core@latest

# Eller spesifiser versjon
npm install @notifyplan/core@2.1.0
```

### **Manuell versjonskontroll:**

```typescript
// Sjekk versjon før oppdatering
const versionCheck = await checkVersion('2.0.0')

if (versionCheck.updateAvailable) {
  if (!versionCheck.breaking) {
    // Safe to update
    await updatePackage('@notifyplan/core', versionCheck.latest)
  } else {
    // Read migration guide first
    console.log(versionCheck.compatibility.migrationGuide)
  }
}
```

---

## ⚠️ Breaking Changes

Når en **MAJOR** versjon lanseres, vil vi:

1. **Publisere migrasjonsguide** minst 30 dager før
2. **Deprecation warnings** i minst 2 MINOR versjoner
3. **Dokumentere alle endringer** i CHANGELOG.md
4. **Tilby support** for migrasjon

**Eksempel:**
- `2.9.0` - Deprecation warning
- `2.10.0` - Deprecation warning fortsatt
- `3.0.0` - Breaking change (30+ dager etter første warning)

---

## 🔐 Sikkerhetspatches

**Kritiske sikkerhetspatches** kan lanseres som **PATCH** versjoner uten forvarsel.

**Anbefaling:** Oppdater alltid til latest patch for sikkerhet.

```bash
# Sjekk for sikkerhetspatches
npm audit @notifyplan/core

# Oppdater umiddelbart
npm install @notifyplan/core@latest
```

---

## 📚 Ressurser

- **API Dokumentasjon:** https://docs.notifyplan.io/api
- **Migrasjonsguider:** https://docs.notifyplan.io/migration
- **Changelog:** https://github.com/catohansen/notifyplan-2-0/blob/main/packages/notifyplan-core/CHANGELOG.md
- **Support:** support@notifyplan.io

---

**Utviklet med ❤️ av Cato Hansen**  
**Copyright © 2025 Cato Hansen. All rights reserved.**

