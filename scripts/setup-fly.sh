#!/bin/bash

# Required variables
APP_NAME="kindline-care"

echo "Setting secrets for $APP_NAME on Fly.io..."

# NOTE: Replace the placeholders below with actual values before running the script.
# Do not commit the version with actual secrets to version control.
fly secrets set \
  NEXT_PUBLIC_SUPABASE_URL="https://ellswjqkvfcgiaqjuvkn.supabase.co" \
  NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_N9I8ETunkIdn-OISr-daRA_NWAJ8Ekx" \
  SUPABASE_SERVICE_ROLE_KEY="sb_secret_aU9vpUAH5YviePJnkUIK0g_T3REedPp" \
  SUPABASE_DB_PASSWORD="GuU&*yTrCzhumg6" \
  ADMIN_EMAIL="sobhuxa@gmail.com" \
  LENCO_SECRET_KEY="YOUR_LENCO_SECRET_KEY" \
  LENCO_PUBLIC_KEY="YOUR_LENCO_PUBLIC_KEY" \
  LENCO_BASE_URL="https://api.lenco.co/access/v2/" \
  LENCO_SIGNATURE_KEY="YOUR_LENCO_SIGNATURE_KEY" \
  -a $APP_NAME

echo "Secrets staged successfully. They will take effect on the next deployment."
