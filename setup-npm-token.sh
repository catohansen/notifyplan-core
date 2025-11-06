#!/bin/bash

# 🚀 NotifyPlan Core - NPM Token Setup Script
# Dette scriptet hjelper deg med å sette opp NPM_TOKEN i GitHub Secrets

set -e

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🔐 NotifyPlan Core - NPM Token Setup"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Farger
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Dette scriptet hjelper deg med å sette opp NPM_TOKEN${NC}"
echo ""
echo "Steg 1: Hent npm token"
echo "Steg 2: Legg til i GitHub Secrets"
echo ""

# Steg 1: Åpne npm tokens side
echo -e "${YELLOW}📝 Steg 1: Hent npm token${NC}"
echo ""
echo "Åpner npm tokens side..."
open "https://www.npmjs.com/settings/catohansen/tokens" 2>/dev/null || echo "→ https://www.npmjs.com/settings/catohansen/tokens"
echo ""
echo "1. Klikk 'Generate New Token'"
echo "2. Velg 'Automation' type"
echo "3. Kopier tokenet (starter med 'npm_...')"
echo ""
read -p "Har du kopiert tokenet? (ja/nei): " has_token

if [ "$has_token" != "ja" ]; then
    echo ""
    echo "⏸️  Vent mens du henter tokenet..."
    read -p "Trykk Enter når du har tokenet: " dummy
fi

# Steg 2: Åpne GitHub Secrets side
echo ""
echo -e "${YELLOW}📝 Steg 2: Legg til i GitHub Secrets${NC}"
echo ""
echo "Åpner GitHub Secrets side..."
open "https://github.com/catohansen/notifyplan-core/settings/secrets/actions" 2>/dev/null || echo "→ https://github.com/catohansen/notifyplan-core/settings/secrets/actions"
echo ""
echo "1. Klikk 'New repository secret'"
echo "2. Name: NPM_TOKEN"
echo "3. Secret: Lim inn tokenet du kopierte"
echo "4. Klikk 'Add secret'"
echo ""

# Spør om de vil sette det manuelt eller prøve via GitHub CLI
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✅ GitHub CLI er installert!${NC}"
    echo ""
    read -p "Vil du sette NPM_TOKEN via GitHub CLI? (ja/nei): " use_cli
    
    if [ "$use_cli" == "ja" ]; then
        echo ""
        read -p "Lim inn NPM_TOKEN her: " npm_token
        
        if [ -n "$npm_token" ]; then
            echo ""
            echo "🔐 Setter NPM_TOKEN i GitHub Secrets..."
            gh secret set NPM_TOKEN --repo catohansen/notifyplan-core --body "$npm_token"
            
            if [ $? -eq 0 ]; then
                echo ""
                echo -e "${GREEN}✅ NPM_TOKEN er satt!${NC}"
                echo ""
                echo "🎉 Alt er klart! GitHub Actions vil nå publisere automatisk."
                echo ""
                echo "📦 For å trigge publishing:"
                echo "   git tag -d v2.0.0 && git tag v2.0.0 && git push origin v2.0.0 --force"
                echo ""
            else
                echo ""
                echo "❌ Feil ved setting av secret. Prøv manuelt via GitHub web interface."
                echo ""
            fi
        else
            echo ""
            echo "⚠️  Ingen token oppgitt. Sett det manuelt via GitHub web interface."
            echo ""
        fi
    else
        echo ""
        echo "📝 Sett NPM_TOKEN manuelt via GitHub web interface (åpnet i nettleseren)."
        echo ""
        read -p "Trykk Enter når du har satt NPM_TOKEN: " dummy
    fi
else
    echo "📝 Sett NPM_TOKEN manuelt via GitHub web interface (åpnet i nettleseren)."
    echo ""
    read -p "Trykk Enter når du har satt NPM_TOKEN: " dummy
fi

# Verifiser
echo ""
echo -e "${BLUE}🔍 Verifiserer...${NC}"
echo ""

if command -v gh &> /dev/null; then
    echo "Sjekker om NPM_TOKEN er satt..."
    gh secret list --repo catohansen/notifyplan-core | grep -q NPM_TOKEN && echo -e "${GREEN}✅ NPM_TOKEN er satt!${NC}" || echo -e "${YELLOW}⚠️  NPM_TOKEN ikke funnet. Sjekk manuelt.${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📦 NPM_TOKEN er nå satt!"
echo ""
echo "🚀 Neste steg:"
echo "   1. GitHub Actions vil automatisk publisere når du pusher en tag"
echo "   2. Eller manuelt: git tag v2.0.0 && git push origin v2.0.0"
echo ""
echo "📊 Sjekk status:"
echo "   https://github.com/catohansen/notifyplan-core/actions"
echo ""

