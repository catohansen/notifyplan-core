# 🤝 Contributing to NotifyPlan Core

**Takk for at du vurderer å bidra til NotifyPlan Core!**

Denne guiden forklarer hvordan du kan bidra med features, bug fixes, og forbedringer.

---

## 🎯 Hvordan bidra

### **1. Feature Proposals**

Hvis du har en idé for en ny feature:

1. **Sjekk eksisterende issues** på GitHub
2. **Opprett en feature proposal** via API eller GitHub Issue
3. **Vent på evaluering** fra maintainers
4. **Følg guiden** hvis feature aksepteres

**Via API:**
```typescript
POST /api/v1/features/propose
{
  "feature": {
    "name": "my_feature",
    "description": "Description of feature",
    "code": "...",
    "tests": "...",
    "breaking": false,
    "priority": "medium"
  },
  "source": "your-project",
  "contact": "your@email.com"
}
```

**Via GitHub:**
- Opprett en issue med label `feature-proposal`
- Følg template for feature proposals

---

### **2. Bug Reports**

Hvis du finner en bug:

1. **Sjekk eksisterende issues** først
2. **Opprett en bug report** med:
   - Beskrivelse av problemet
   - Steg for å reprodusere
   - Forventet vs faktisk oppførsel
   - Versjon av NotifyPlan Core
   - Environment (Node.js versjon, OS, etc.)

**Template:**
```markdown
## Bug Description
[Beskriv problemet]

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
[Beskriv hva du forventet]

## Actual Behavior
[Beskriv hva som faktisk skjedde]

## Environment
- NotifyPlan Core: 2.0.0
- Node.js: 18.0.0
- OS: macOS 14.0
```

---

### **3. Pull Requests**

Hvis du vil sende inn kode:

1. **Fork repository**
2. **Opprett en branch:** `git checkout -b feature/my-feature`
3. **Commit changes:** `git commit -m "Add: my feature"`
4. **Push til GitHub:** `git push origin feature/my-feature`
5. **Opprett Pull Request**

**PR Guidelines:**
- ✅ Følg kode-stil (ESLint, Prettier)
- ✅ Inkluder tests
- ✅ Oppdater dokumentasjon
- ✅ Sjekk at alle tests passerer
- ✅ Ikke breaking changes uten diskusjon

---

## 📋 Code Standards

### **TypeScript:**
- Bruk TypeScript for all ny kode
- Følg eksisterende kode-stil
- Type-safe hvor mulig

### **Testing:**
- Skriv tests for nye features
- Sørg for >80% code coverage
- Test både happy path og edge cases

### **Dokumentasjon:**
- Dokumenter alle nye funksjoner
- Oppdater README.md hvis nødvendig
- Legg til eksempler i dokumentasjonen

---

## 🔄 Workflow

### **Development Workflow:**

1. **Clone repository:**
   ```bash
   git clone https://github.com/catohansen/notifyplan-2-0.git
   cd notifyplan-2-0/packages/notifyplan-core
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

4. **Make changes:**
   - Opprett feature branch
   - Implementer endringer
   - Skriv tests
   - Oppdater dokumentasjon

5. **Submit PR:**
   - Push til GitHub
   - Opprett Pull Request
   - Vent på review

---

## 🎯 Feature Evaluation Criteria

Features evalueres basert på:

1. **Alignment med vision:**
   - Passer det inn i NotifyPlan's mål?
   - Er det relevant for notification system?

2. **Code quality:**
   - Er koden ren og vedlikeholdbar?
   - Er det godt testet?
   - Følger det best practices?

3. **Breaking changes:**
   - Er det backward compatible?
   - Hvis breaking, er det verdt det?

4. **Priority:**
   - Hvor viktig er featuren?
   - Hvor mange brukere vil dra nytte?

---

## 📝 Commit Messages

Følg [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Typer:**
- `feat:` Ny feature
- `fix:` Bug fix
- `docs:` Dokumentasjon
- `style:` Kode-stil (formatting)
- `refactor:` Refactoring
- `test:` Tester
- `chore:` Maintenance

**Eksempler:**
```
feat(orchestrator): add smart digest algorithm

fix(email): handle rate limit errors gracefully

docs(readme): update installation guide
```

---

## 🚫 Hva IKKE å bidra med

- ❌ Breaking changes uten diskusjon
- ❌ Features som ikke er relatert til notifications
- ❌ Kode uten tests
- ❌ Kode som ikke følger TypeScript best practices
- ❌ Features som krever eksterne dependencies uten god grunn

---

## 🎓 Learning Resources

- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **Semantic Versioning:** https://semver.org/
- **Conventional Commits:** https://www.conventionalcommits.org/
- **Testing Best Practices:** https://testingjavascript.com/

---

## 💬 Support

Har du spørsmål?

- **GitHub Issues:** For bugs og feature requests
- **Discussions:** For generelle spørsmål
- **Email:** support@notifyplan.io

---

## 🙏 Takk!

Takk for at du bidrar til NotifyPlan Core! Alle bidrag, store som små, er verdsatt.

---

**Utviklet med ❤️ av Cato Hansen**  
**Copyright © 2025 Cato Hansen. All rights reserved.**

