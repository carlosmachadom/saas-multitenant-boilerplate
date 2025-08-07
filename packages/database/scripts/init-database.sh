#!/bin/bash

# Salir inmediatamente si un comando falla.
set -e

# Script para inicializar la base de datos usando la nueva estructura modular.
#
# USO:
# ./init-database.sh [admin|tenant|full] [tenant_id]
#
# EJEMPLO:
# ./init-database.sh full
# ./init-database.sh admin
# ./init-database.sh tenant
# ./init-database.sh tenant my-tenant-id

OPERATION=${1:-"full"}
TENANT_ID=${2:-""}

echo "🚀 Inicializando base de datos - Operación: ${OPERATION}"

case $OPERATION in
  "admin")
    echo "🔧 Inicializando esquema admin..."
    tsx src/devops/cli/init-database.ts admin
    ;;
  "tenant")
    if [ -z "$TENANT_ID" ]; then
      echo "🏗️  Inicializando tenant template..."
      tsx src/devops/cli/init-database.ts tenant
    else
      echo "🏢 Inicializando tenant: $TENANT_ID"
      tsx src/devops/cli/init-database.ts tenant "$TENANT_ID"
    fi
    ;;
  "full")
    echo "🔄 Inicialización completa (admin + tenant template)..."
    tsx src/devops/cli/init-database.ts full
    ;;
  *)
    echo "❌ Operación no válida: $OPERATION"
    echo "Uso: $0 [admin|tenant|full] [tenant_id]"
    echo ""
    echo "Operaciones disponibles:"
    echo "  admin           - Solo inicializar esquema admin"
    echo "  tenant          - Inicializar tenant template"
    echo "  tenant <id>     - Inicializar tenant específico"
    echo "  full            - Inicialización completa (admin + tenant template) (por defecto)"
    exit 1
    ;;
esac

echo "✅ Inicialización completada exitosamente"
