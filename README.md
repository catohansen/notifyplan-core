# 📦 NotifyPlan Core

**Open Core notification system - MIT License**

[![npm version](https://img.shields.io/npm/v/@notifyplan/core)](https://www.npmjs.com/package/@notifyplan/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/stars/catohansen/notifyplan-core)](https://github.com/catohansen/notifyplan-core)

---

## 🎯 Hva er NotifyPlan Core?

NotifyPlan Core er en **Open Core** notification system som gir deg:
- ✅ Multi-channel notifications (email, SMS, push, in-app)
- ✅ Smart digest engine
- ✅ Workflow engine
- ✅ Compatibility layer for version migration
- ✅ TypeScript support
- ✅ Self-hosting mulighet

**MIT License** - Bruk fritt i dine prosjekter!

---

## 🚀 Quick Start

### Install

```bash
npm install @notifyplan/core
```

### Usage

```typescript
import { NotificationOrchestrator, DigestEngine, WorkflowEngine } from '@notifyplan/core'

// Initialize orchestrator with adapters
const orchestrator = NotificationOrchestrator.create(
  databaseAdapter,
  emailAdapter,
  smsAdapter
)

// Send notification
const result = await orchestrator.send({
  userId: 'user_123',
  type: 'welcome',
  title: 'Welcome!',
  message: 'Thanks for joining!',
  channels: ['email', 'push'],
  priority: 'high'
})
```

---

## 📚 Documentation

- **[VERSIONING.md](./VERSIONING.md)** - Semantic versioning guide
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute
- **[NPM_PUBLISHING.md](./NPM_PUBLISHING.md)** - Publishing guide
- **[API Documentation](https://docs.notifyplan.io/api)** - Full API reference

---

## 🔄 Version Control

Sjekk for oppdateringer:

```typescript
import { CompatibilityLayer } from '@notifyplan/core'

const compatibility = CompatibilityLayer.isCompatible('2.0.0', '2.1.0')
if (compatibility.compatible && !compatibility.breaking) {
  // Safe to update
}
```

---

## 🤝 Contributing

Vi setter pris på alle bidrag! Se [CONTRIBUTING.md](./CONTRIBUTING.md) for detaljer.

**Feature Proposals:**
- Send via API: `POST /api/v1/features/propose`
- Eller opprett GitHub Issue

---

## 📄 License

MIT License - se [LICENSE](./LICENSE) for detaljer.

---

## 🔗 Links

- **SaaS Hosted:** https://notifyplan.io
- **Documentation:** https://docs.notifyplan.io
- **GitHub:** https://github.com/catohansen/notifyplan-core
- **npm:** https://www.npmjs.com/package/@notifyplan/core

---

## 🏢 Business Model

NotifyPlan Core følger en **Hybrid Open Core-modell**:
- **Open Core (MIT):** Gratis, selvhøstet versjon
- **SaaS Hosted:** Betalt, fullt administrert tjeneste
- **Self-Hosted Enterprise:** Betalt, on-premise løsning

Se [BUSINESS_STRATEGY.md](../notifyplan-online/BUSINESS_STRATEGY.md) for detaljer.

---

**Utviklet med ❤️ av Cato Hansen**  
**Copyright © 2025 Cato Hansen. All rights reserved.**
