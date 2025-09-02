#!/bin/sh

# Salir inmediatamente si un comando falla.
set -e

# Script para generar una migración de TypeORM usando la nueva estructura modular.
#
# USO:
# ./generate-migration.sh <admin|tenant> <NombreDeLaMigracion>
#
# EJEMPLO:
# ./generate-migration.sh admin InitialSetup

# --- Validación de argumentos ---
if [ "$#" -ne 2 ]; then
    echo "Error: Se requieren dos argumentos."
    echo "Uso: $0 <admin|tenant> <NombreDeLaMigracion>"
    exit 1
fi

SCHEMA_TYPE=$1
MIGRATION_NAME=$2

if [ "$SCHEMA_TYPE" != "admin" ] && [ "$SCHEMA_TYPE" != "tenant" ]; then
    echo "Error: El primer argumento debe ser 'admin' o 'tenant'."
    exit 1
fi

echo "🚀 Generando migración para ${SCHEMA_TYPE}: ${MIGRATION_NAME}"
echo "📁 Usando nueva estructura modular"

# --- Usar el CLI TypeScript unificado con dotenv-cli ---
DB_HOST=localhost dotenv -e ../../env/database/.env -e ../../env/database/.env.development.local -- \
  tsx src/devops/cli/generate-migration.ts "$SCHEMA_TYPE" "$MIGRATION_NAME"

echo "✅ Script completado"
