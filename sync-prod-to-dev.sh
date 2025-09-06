#!/bin/bash
# Sync production Convex data to dev environment

echo "📦 Exporting production data..."
npx convex export --prod

echo "📥 Importing to dev environment..."
npx convex import

echo "✅ Sync complete!"
