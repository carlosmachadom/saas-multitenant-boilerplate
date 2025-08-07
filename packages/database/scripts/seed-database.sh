#!/bin/bash

# Salir inmediatamente si un comando falla.
set -e

# Script para ejecutar seeds usando la nueva estructura modular.
#
# USO:
# ./seed-database.sh <admin|tenant> [tenant_schema]
#
# EJEMPLO:
# ./seed-database.sh admin
# ./seed-database.sh tenant tenant_template

# --- Validación de argumentos ---
if [ "$#" -lt 1 ]; then
    echo "Error: Se requiere al menos un argumento."
    echo "Uso: $0 <admin|tenant> [tenant_schema]"
    echo "       Si no se especifica tenant_schema, se usará 'tenant_template'"
    exit 1
fi

SCHEMA_TYPE=$1
TENANT_SCHEMA=${2:-'tenant_template'}

if [ "$SCHEMA_TYPE" != "admin" ] && [ "$SCHEMA_TYPE" != "tenant" ]; then
    echo "Error: El primer argumento debe ser 'admin' o 'tenant'."
    exit 1
fi

echo "🌱 Ejecutando seeds para ${SCHEMA_TYPE}"
echo "📁 Esquema: ${TENANT_SCHEMA}"

# --- Usar el CLI TypeScript unificado con dotenv-cli ---
if [ "$SCHEMA_TYPE" = "admin" ]; then
    DB_HOST=localhost dotenv -e ../../env/database/.env -e ../../env/database/.env.development.local -- \
      tsx src/devops/cli/seed-admin.ts
else
    DB_HOST=localhost dotenv -e ../../env/database/.env -e ../../env/database/.env.development.local -- \
      tsx src/devops/cli/seed-tenant.ts "$TENANT_SCHEMA"
fi

echo "✅ Script completado"
