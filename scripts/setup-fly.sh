#!/bin/bash

# Required variables
APP_NAME="kindline-care"

echo "Setting secrets for $APP_NAME on Fly.io..."

# NOTE: Replace the placeholders below with actual values before running the script.
# Do not commit the version with actual secrets to version control.
fly secrets set \
  NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL" \
  NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY" \
  SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY" \
  SUPABASE_DB_PASSWORD="YOUR_SUPABASE_DB_PASSWORD" \
  ADMIN_EMAIL="YOUR_ADMIN_EMAIL" \
  LENCO_SECRET_KEY="YOUR_LENCO_SECRET_KEY" \
  LENCO_PUBLIC_KEY="YOUR_LENCO_PUBLIC_KEY" \
  LENCO_BASE_URL="https://api.lenco.co/access/v2/" \
  LENCO_SIGNATURE_KEY="YOUR_LENCO_SIGNATURE_KEY" \
  -a $APP_NAME

echo "Secrets staged successfully. They will take effect on the next deployment."
