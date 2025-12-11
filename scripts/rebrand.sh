#!/bin/bash

# Twenty CRM Rebranding Script
# This script automates the rebranding process for the Twenty CRM codebase
# 
# Usage:
#   1. Set the variables below (NEW_BRAND_NAME, etc.)
#   2. Make script executable: chmod +x scripts/rebrand.sh
#   3. Run from repository root: ./scripts/rebrand.sh
#
# WARNING: This script makes extensive changes. Create a backup branch first!

set -e  # Exit on error

# ============================================================================
# CONFIGURATION - ARJUNA CRM REBRANDING
# ============================================================================

# New brand name (PascalCase for display)
NEW_BRAND_NAME="ArjunaCRM"

# New brand name (lowercase for packages, URLs)
NEW_BRAND_NAME_LOWER="arjuna"

# New brand name (uppercase for constants)
NEW_BRAND_NAME_UPPER="ARJUNA"

# New organization name (for GitHub, etc.) - URL-friendly version
NEW_ORG_NAME="vedpragyabharat"

# New organization display name (for display text)
NEW_ORG_DISPLAY_NAME="Vedpragya Bharat"

# New domain
NEW_DOMAIN="vedpragya.com"
NEW_DOCS_DOMAIN="docs.vedpragya.com"

# New social media handle (optional)
NEW_SOCIAL_HANDLE="@arjunacrm"

# ============================================================================
# OLD VALUES (DO NOT MODIFY)
# ============================================================================

OLD_BRAND_NAME="Twenty"
OLD_BRAND_NAME_LOWER="twenty"
OLD_BRAND_NAME_UPPER="TWENTY"
OLD_ORG_NAME="twentyhq"
OLD_DOMAIN="twenty.com"
OLD_DOCS_DOMAIN="docs.twenty.com"
OLD_SOCIAL_HANDLE="@twentycrm"

# ============================================================================
# SCRIPT START
# ============================================================================

echo "=========================================="
echo "Twenty CRM → ArjunaCRM Rebranding Script"
echo "=========================================="
echo ""
echo "New Brand Name: $NEW_BRAND_NAME"
echo "New Brand Name (lowercase): $NEW_BRAND_NAME_LOWER"
echo "New Organization: $NEW_ORG_DISPLAY_NAME ($NEW_ORG_NAME)"
echo "New Domain: $NEW_DOMAIN"
echo ""
echo "Starting rebranding process..."
echo ""

# Function to replace in files
replace_in_files() {
    local search=$1
    local replace=$2
    local description=$3
    
    echo "  Replacing: $description"
    find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \
        -o -name "*.json" -o -name "*.md" -o -name "*.mdx" -o -name "*.html" \
        -o -name "*.yml" -o -name "*.yaml" -o -name "*.env*" -o -name "*.cjs" \
        -o -name "*.mjs" \) \
        ! -path "*/node_modules/*" \
        ! -path "*/.git/*" \
        ! -path "*/dist/*" \
        ! -path "*/build/*" \
        ! -path "*/coverage/*" \
        -exec sed -i "s|$search|$replace|g" {} +
}

# Function to replace case-sensitive
replace_in_files_case_sensitive() {
    local search=$1
    local replace=$2
    local description=$3
    
    echo "  Replacing (case-sensitive): $description"
    find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \
        -o -name "*.json" -o -name "*.md" -o -name "*.mdx" -o -name "*.html" \
        -o -name "*.yml" -o -name "*.yaml" -o -name "*.env*" -o -name "*.cjs" \
        -o -name "*.mjs" \) \
        ! -path "*/node_modules/*" \
        ! -path "*/.git/*" \
        ! -path "*/dist/*" \
        ! -path "*/build/*" \
        ! -path "*/coverage/*" \
        -exec sed -i "s|$search|$replace|g" {} +
}

echo ""
echo "=========================================="
echo "Phase 1: Text Replacements"
echo "=========================================="

# Replace brand names (case-sensitive)
replace_in_files_case_sensitive "$OLD_BRAND_NAME" "$NEW_BRAND_NAME" "Brand name (PascalCase)"
replace_in_files "$OLD_BRAND_NAME_LOWER" "$NEW_BRAND_NAME_LOWER" "Brand name (lowercase)"
replace_in_files "$OLD_BRAND_NAME_UPPER" "$NEW_BRAND_NAME_UPPER" "Brand name (uppercase)"

# Replace organization name (URL-friendly)
replace_in_files "$OLD_ORG_NAME" "$NEW_ORG_NAME" "Organization name (URL)"

# Replace organization display name (with spaces)
replace_in_files_case_sensitive "Twenty" "$NEW_BRAND_NAME" "Brand name in organization context"
# Note: "Vedpragya Bharat" will be handled by individual replacements if needed

# Replace domains
if [ ! -z "$NEW_DOMAIN" ]; then
    replace_in_files "$OLD_DOMAIN" "$NEW_DOMAIN" "Domain name"
fi

if [ ! -z "$NEW_DOCS_DOMAIN" ]; then
    replace_in_files "$OLD_DOCS_DOMAIN" "$NEW_DOCS_DOMAIN" "Documentation domain"
fi

# Replace social media handle
if [ ! -z "$NEW_SOCIAL_HANDLE" ]; then
    replace_in_files "$OLD_SOCIAL_HANDLE" "$NEW_SOCIAL_HANDLE" "Social media handle"
fi

# Replace GitHub URLs
replace_in_files "github.com/$OLD_ORG_NAME" "github.com/$NEW_ORG_NAME" "GitHub organization URLs"
replace_in_files "raw.githubusercontent.com/$OLD_ORG_NAME" "raw.githubusercontent.com/$NEW_ORG_NAME" "GitHub raw URLs"

echo ""
echo "=========================================="
echo "Phase 2: Package Directory Renaming"
echo "=========================================="

# List of packages to rename
PACKAGES=(
    "twenty-front:$NEW_BRAND_NAME_LOWER-front"
    "twenty-server:$NEW_BRAND_NAME_LOWER-server"
    "twenty-ui:$NEW_BRAND_NAME_LOWER-ui"
    "twenty-shared:$NEW_BRAND_NAME_LOWER-shared"
    "twenty-utils:$NEW_BRAND_NAME_LOWER-utils"
    "twenty-emails:$NEW_BRAND_NAME_LOWER-emails"
    "twenty-website:$NEW_BRAND_NAME_LOWER-website"
    "twenty-docs:$NEW_BRAND_NAME_LOWER-docs"
    "twenty-zapier:$NEW_BRAND_NAME_LOWER-zapier"
    "twenty-cli:$NEW_BRAND_NAME_LOWER-cli"
    "twenty-sdk:$NEW_BRAND_NAME_LOWER-sdk"
    "twenty-apps:$NEW_BRAND_NAME_LOWER-apps"
    "create-twenty-app:create-$NEW_BRAND_NAME_LOWER-app"
    "twenty-e2e-testing:$NEW_BRAND_NAME_LOWER-e2e-testing"
)

echo "Renaming package directories..."
for package_pair in "${PACKAGES[@]}"; do
    OLD_PKG=$(echo $package_pair | cut -d: -f1)
    NEW_PKG=$(echo $package_pair | cut -d: -f2)
    
    if [ -d "packages/$OLD_PKG" ]; then
        echo "  Renaming packages/$OLD_PKG -> packages/$NEW_PKG"
        git mv "packages/$OLD_PKG" "packages/$NEW_PKG" || mv "packages/$OLD_PKG" "packages/$NEW_PKG"
    else
        echo "  Warning: packages/$OLD_PKG not found, skipping..."
    fi
done

echo ""
echo "=========================================="
echo "Phase 3: Configuration File Updates"
echo "=========================================="

echo "Updating package.json files..."
# Update package.json files in renamed directories
for package_pair in "${PACKAGES[@]}"; do
    OLD_PKG=$(echo $package_pair | cut -d: -f1)
    NEW_PKG=$(echo $package_pair | cut -d: -f2)
    
    PKG_JSON="packages/$NEW_PKG/package.json"
    if [ -f "$PKG_JSON" ]; then
        echo "  Updating $PKG_JSON"
        sed -i "s|\"name\": \"$OLD_PKG\"|\"name\": \"$NEW_PKG\"|g" "$PKG_JSON"
        # Update workspace references
        sed -i "s|$OLD_PKG|$NEW_PKG|g" "$PKG_JSON"
    fi
done

# Update root package.json workspace references
echo "  Updating root package.json"
if [ -f "package.json" ]; then
    for package_pair in "${PACKAGES[@]}"; do
        OLD_PKG=$(echo $package_pair | cut -d: -f1)
        NEW_PKG=$(echo $package_pair | cut -d: -f2)
        sed -i "s|packages/$OLD_PKG|packages/$NEW_PKG|g" "package.json"
        sed -i "s|\"$OLD_PKG\"|\"$NEW_PKG\"|g" "package.json"
    done
fi

# Update yarn.config.cjs workspace references
echo "  Updating yarn.config.cjs"
if [ -f "yarn.config.cjs" ]; then
    for package_pair in "${PACKAGES[@]}"; do
        OLD_PKG=$(echo $package_pair | cut -d: -f1)
        NEW_PKG=$(echo $package_pair | cut -d: -f2)
        sed -i "s|packages/$OLD_PKG|packages/$NEW_PKG|g" "yarn.config.cjs"
    done
fi

# Update nx.json project references
echo "  Updating nx.json"
if [ -f "nx.json" ]; then
    for package_pair in "${PACKAGES[@]}"; do
        OLD_PKG=$(echo $package_pair | cut -d: -f1)
        NEW_PKG=$(echo $package_pair | cut -d: -f2)
        sed -i "s|\"$OLD_PKG\"|\"$NEW_PKG\"|g" "nx.json"
    done
fi

# Update tsconfig.base.json path mappings
echo "  Updating tsconfig.base.json"
if [ -f "tsconfig.base.json" ]; then
    for package_pair in "${PACKAGES[@]}"; do
        OLD_PKG=$(echo $package_pair | cut -d: -f1)
        NEW_PKG=$(echo $package_pair | cut -d: -f2)
        sed -i "s|@$OLD_PKG|@$NEW_PKG|g" "tsconfig.base.json"
        sed -i "s|packages/$OLD_PKG|packages/$NEW_PKG|g" "tsconfig.base.json"
    done
fi

echo ""
echo "=========================================="
echo "Rebranding Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Review the changes: git status"
echo "2. Check for remaining references: grep -r 'twenty' --exclude-dir=node_modules --exclude-dir=.git"
echo "3. Replace logo files manually:"
echo "   - packages/$NEW_BRAND_NAME_LOWER-website/public/images/core/logo.svg"
echo "   - packages/$NEW_BRAND_NAME_LOWER-docs/logo.svg"
echo "   - packages/$NEW_BRAND_NAME_LOWER-docs/images/core/logo.svg"
echo "4. Replace favicon: packages/$NEW_BRAND_NAME_LOWER-docs/favicon.png"
echo "5. Test the build: yarn install && yarn build"
echo "6. Test the application: yarn start"
echo ""
echo "IMPORTANT: Review all changes before committing!"

