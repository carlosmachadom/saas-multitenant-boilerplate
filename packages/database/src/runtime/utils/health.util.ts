import { HealthCheckResult } from "@core/interfaces";
import { DataSource } from "typeorm";

export async function checkHealth(
  dataSource: DataSource
): Promise<HealthCheckResult> {
  const connectionName =
    dataSource.options.type === "postgres"
      ? dataSource.options.schema
      : dataSource.options.database;

  try {
    if (!dataSource?.isInitialized) {
      return {
        status: "down",
        details: {
          database: "PostgreSQL",
          connection: connectionName,
          isConnected: false,
          message: "DataSource not initialized",
        },
      };
    }

    await dataSource.query("SELECT 1");

    return {
      status: "up",
      details: {
        database: "PostgreSQL",
        connection: connectionName,
        isConnected: true,
      },
    };
  } catch (error) {
    return {
      status: "down",
      details: {
        database: "PostgreSQL",
        connection: connectionName,
        isConnected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
