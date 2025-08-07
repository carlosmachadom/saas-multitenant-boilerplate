#!/bin/bash

# Salir inmediatamente si un comando falla.
set -e

# Script para ejecutar migraciones usando la nueva estructura modular.
#
# USO:
# ./run-migrations.sh <admin|tenant> [tenant_schema]
#
# EJEMPLO:
# ./run-migrations.sh admin
# ./run-migrations.sh tenant tenant_template

# --- Validación de argumentos ---
if [ "$#" -lt 1 ]; then
    echo "Error: Se requiere al menos un argumento."
    echo "Uso: $0 <admin|tenant> [tenant_schema]"
    exit 1
fi

SCHEMA_TYPE=$1
TENANT_SCHEMA=$2

if [ "$SCHEMA_TYPE" != "admin" ] && [ "$SCHEMA_TYPE" != "tenant" ]; then
    echo "Error: El primer argumento debe ser 'admin' o 'tenant'."
    exit 1
fi

echo "🚀 Ejecutando migraciones para ${SCHEMA_TYPE}"
if [ -n "$TENANT_SCHEMA" ]; then
    echo "📁 Esquema tenant: ${TENANT_SCHEMA}"
fi

# --- Usar el CLI TypeScript unificado con dotenv-cli ---
if [ "$SCHEMA_TYPE" = "admin" ]; then
    DB_HOST=localhost dotenv -e ../../env/database/.env -e ../../env/database/.env.development.local -- \
      tsx src/devops/cli/run-migrations.ts admin
else
    DB_HOST=localhost dotenv -e ../../env/database/.env -e ../../env/database/.env.development.local -- \
      tsx src/devops/cli/run-migrations.ts tenant "$TENANT_SCHEMA"
fi

echo "✅ Script completado"
