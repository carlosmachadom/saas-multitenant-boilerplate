#!/bin/sh

# Salir inmediatamente si un comando falla.
set -e

# Script para ejecutar seeds usando la nueva estructura modular.
#
# USO:
# ./seed-database.sh [admin|tenant] [tenant_schema]
#
# EJEMPLO:
# ./seed-database.sh                    # Ejecuta ambas semillas (admin + tenant)
# ./seed-database.sh admin              # Solo admin
# ./seed-database.sh tenant             # Solo tenant con tenant_template
# ./seed-database.sh tenant mi_schema   # Solo tenant con mi_schema

# Función para ejecutar seed de admin
execute_admin_seed() {
    echo "🌱 Ejecutando seeds para admin"
    DB_HOST=localhost dotenv -e ../../env/database/.env -e ../../env/database/.env.development.local -- \
      tsx src/devops/cli/seed-admin.ts
    echo "✅ Seeds de admin completados"
}

# Función para ejecutar seed de tenant
execute_tenant_seed() {
    local tenant_schema=${1:-'tenant_template'}
    echo "🌱 Ejecutando seeds para tenant"
    echo "📁 Esquema: ${tenant_schema}"
    DB_HOST=localhost dotenv -e ../../env/database/.env -e ../../env/database/.env.development.local -- \
      tsx src/devops/cli/seed-tenant.ts "$tenant_schema"
    echo "✅ Seeds de tenant completados"
}

# --- Validación y ejecución ---
if [ "$#" -eq 0 ]; then
    # Sin parámetros: ejecutar ambas semillas
    echo "🚀 No se especificaron parámetros. Ejecutando ambas semillas..."
    echo ""
    execute_admin_seed
    echo ""
    execute_tenant_seed "tenant_template"
    echo ""
    echo "✅ Todas las semillas completadas"
    exit 0
fi

# Con parámetros: validar y ejecutar según especificación
SCHEMA_TYPE=$1
TENANT_SCHEMA=${2:-'tenant_template'}

if [ "$SCHEMA_TYPE" != "admin" ] && [ "$SCHEMA_TYPE" != "tenant" ]; then
    echo "Error: El primer argumento debe ser 'admin' o 'tenant'."
    echo "Uso: $0 [admin|tenant] [tenant_schema]"
    echo "       Si no se especifica nada, se ejecutarán ambas semillas"
    echo "       Si no se especifica tenant_schema, se usará 'tenant_template'"
    exit 1
fi

# Ejecutar la semilla específica solicitada
if [ "$SCHEMA_TYPE" = "admin" ]; then
    execute_admin_seed
else
    execute_tenant_seed "$TENANT_SCHEMA"
fi

echo "✅ Script completado"
