#!/bin/bash

# YdvMusic Admin Email Setup Script
# This script helps you quickly configure admin emails for the YdvMusic application

echo "🎵 YdvMusic Admin Email Configuration Setup"
echo "=========================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Creating one..."
    touch .env
fi

# Backup existing .env
if [ -f ".env" ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created: .env.backup.$(date +%Y%m%d_%H%M%S)"
fi

echo ""
echo "📧 Configure Admin Emails"
echo "------------------------"

# Prompt for admin emails
read -p "Enter admin email addresses (comma-separated): " admin_emails

# Prompt for exact match requirement
echo ""
echo "🔐 Security Settings"
echo "-------------------"
read -p "Require exact email match? (y/n, default: n): " exact_match
exact_match=${exact_match:-n}

if [[ $exact_match =~ ^[Yy]$ ]]; then
    exact_match_value="true"
    echo "✅ Exact match enabled - only listed emails will have admin access"
else
    exact_match_value="false"
    read -p "Fallback keyword for admin detection (default: admin): " fallback_keyword
    fallback_keyword=${fallback_keyword:-admin}
    echo "✅ Keyword fallback enabled - emails containing '$fallback_keyword' will have admin access"
fi

# Update .env file
echo "" >> .env
echo "# Admin Configuration (Added by setup script)" >> .env
echo "# Comma-separated list of admin email addresses" >> .env
echo "VITE_ADMIN_EMAILS=$admin_emails" >> .env
echo "" >> .env
echo "# Admin Settings" >> .env
echo "VITE_ADMIN_REQUIRE_EXACT_MATCH=$exact_match_value" >> .env

if [[ $exact_match_value == "false" ]]; then
    echo "VITE_ADMIN_FALLBACK_KEYWORD=$fallback_keyword" >> .env
fi

echo ""
echo "✅ Configuration Complete!"
echo "========================="
echo ""
echo "📋 Summary:"
echo "- Admin emails: $admin_emails"
echo "- Exact match: $exact_match_value"
if [[ $exact_match_value == "false" ]]; then
    echo "- Fallback keyword: $fallback_keyword"
fi
echo ""
echo "🚀 Next Steps:"
echo "1. Restart your development server (npm run dev)"
echo "2. Sign in with one of the admin emails"
echo "3. Access Admin Dashboard from the sidebar"
echo "4. Use Admin Settings tab to manage emails via UI"
echo ""
echo "📖 For detailed documentation, see: docs/ADMIN_EMAIL_GUIDE.md"
echo ""
echo "🧪 Demo Accounts Available:"
echo "- Regular User: demo@example.com / password123"
echo "- Admin User: admin@ydvmusic.com / admin123"