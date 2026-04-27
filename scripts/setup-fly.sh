#!/bin/bash

# Required variables
APP_NAME="kindline-care"

echo "Setting Supabase secrets for $APP_NAME on Fly.io..."

# These were provided by the user and are now being set as secrets
fly secrets set \
  NEXT_PUBLIC_SUPABASE_URL="https://ellswjqkvfcgiaqjuvkn.supabase.co" \
  NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_N9I8ETunkIdn-OISr-daRA_NWAJ8Ekx" \
  SUPABASE_SERVICE_ROLE_KEY="sb_secret_aU9vpUAH5YviePJnkUIK0g_T3REedPp" \
  SUPABASE_DB_PASSWORD="GuU&*yTrCzhumg6" \
  ADMIN_EMAIL="sobhuxa@gmail.com" \
  -a $APP_NAME

echo "Secrets staged successfully. They will take effect on the next deployment."
