# Arquitectura de Autenticación y Autorización

Este documento detalla el diseño de la base de datos y los flujos de información para el módulo de autenticación (AuthN) y autorización (AuthZ) del boilerplate. El objetivo es crear un sistema seguro, escalable y flexible que sirva como base para cualquier aplicación SaaS.

## 1. Diagrama de Entidad-Relación (ERD)

El siguiente diagrama muestra la estructura completa de las tablas relacionadas con la gestión de usuarios, roles, permisos, sesiones y API keys.

```mermaid
erDiagram
  USER {
    uuid id PK
    string email
    string password
    boolean is_active
    datetime created_at
    datetime updated_at
    datetime deleted_at
  }

  USER_PROFILE {
    uuid user_id PK
    string full_name
    string phone
    string position
  }

  ROLE {
    uuid id PK
    string name
    string description
  }

  PERMISSION {
    uuid id PK
    string code
    string description
  }

  USER_ROLE {
    uuid user_id FK
    uuid role_id FK
  }

  ROLE_PERMISSION {
    uuid role_id FK
    uuid permission_id FK
  }

  SESSION {
    uuid id PK
    uuid user_id FK
    string user_agent
    string ip_address
    datetime created_at
    datetime last_access_at
    int session_duration_minutes
    boolean is_active
  }   

  REFRESH_TOKEN {
    uuid id PK
    uuid session_id FK
    string token
    datetime expires_at
    datetime created_at
    boolean revoked
  }

  TOKEN_BLACKLIST {
    uuid id PK
    uuid refresh_token_id FK
    uuid reason_id FK
    datetime blacklisted_at
  }

  TOKEN_REVOCATION_REASON {
    uuid id PK
    string code
    string label
    boolean internal_only
  }



  USER ||--o{ USER_ROLE : has
  ROLE ||--o{ USER_ROLE : contains
  ROLE ||--o{ ROLE_PERMISSION : grants
  PERMISSION ||--o{ ROLE_PERMISSION : defines
  USER ||--|| USER_PROFILE : owns
  USER ||--o{ SESSION : initiates
  SESSION ||--|| REFRESH_TOKEN : has
  REFRESH_TOKEN ||--o{ TOKEN_BLACKLIST : blacklisted
  TOKEN_BLACKLIST ||--|| TOKEN_REVOCATION_REASON : reason
```

## 2. Análisis Detallado del Esquema

### Tablas de Identidad y Roles (RBAC)

-   **USER**: Es la entidad central. Almacena las credenciales de inicio de sesión.
    -   *Relación TypeORM*: `OneToOne` con `USER_PROFILE`, `OneToMany` con `SESSION`, `ManyToMany` con `ROLE`.
-   **USER_PROFILE**: Contiene información personal no sensible, separada de las credenciales para mayor seguridad y organización.
    -   *Relación TypeORM*: `OneToOne` con `USER`.
-   **ROLE**: Define un conjunto de responsabilidades (ej. "Administrador", "Editor").
    -   *Relación TypeORM*: `ManyToMany` con `USER` y `PERMISSION`.
-   **PERMISSION**: Representa una acción atómica y específica que un usuario puede realizar (ej. `create:invoice`, `read:user`).
    -   *Relación TypeORM*: `ManyToMany` con `ROLE`.
-   **USER_ROLE** y **ROLE_PERMISSION**: Son las tablas de unión (join tables) para implementar las relaciones `ManyToMany` del sistema de Role-Based Access Control (RBAC).

### Tablas de Sesión y Tokens

-   **SESSION**: Registra cada inicio de sesión de un usuario desde un dispositivo/navegador específico. Permite al usuario ver y cerrar sesiones activas en otros dispositivos.
    -   *Relación TypeORM*: `ManyToOne` con `USER`, `OneToOne` con `REFRESH_TOKEN`.
-   **REFRESH_TOKEN**: Almacena el token de refresco, que es una credencial de larga duración usada para obtener nuevos `access tokens` sin que el usuario tenga que volver a escribir su contraseña.
    -   *Relación TypeORM*: `OneToOne` con `SESSION`.
-   **TOKEN_BLACKLIST** y **TOKEN_REVOCATION_REASON**: Un mecanismo de seguridad crucial. Permite invalidar tokens de refresco de forma explícita (ej. al cerrar sesión, cambiar contraseña) y registrar por qué se hizo.



## 3. Flujo de Inicio de Sesión (Login)

Este diagrama de secuencia muestra cómo interactúan los componentes del sistema cuando un usuario inicia sesión.

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Database

    Client->>API: POST /auth/login (email, password)
    API->>Database: SELECT * FROM user WHERE email = [email]
    Database-->>API: Devuelve datos del usuario (incluyendo password_hash)
    API->>API: Compara hash(password) con password_hash
    alt Credenciales Válidas
        API->>API: Genera Access Token (JWT, corta vida)
        API->>API: Genera Refresh Token (string seguro, larga vida)
        API->>Database: INSERT INTO session (user_id, ip, user_agent)
        Database-->>API: Devuelve nueva session_id
        API->>Database: INSERT INTO refresh_token (session_id, token, expires_at)
        API-->>Client: 200 OK (accessToken, refreshToken)
    else Credenciales Inválidas
        API-->>Client: 401 Unauthorized
    end
```

## 4. Flujo de Refresco de Token

Cuando el `access token` expira, el cliente utiliza el `refresh token` para obtener uno nuevo sin interrumpir al usuario.

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Database

    Client->>API: POST /auth/refresh (refreshToken)
    API->>Database: SELECT * FROM refresh_token WHERE token = [refreshToken]
    alt Token Válido y No Revocado
        Database-->>API: Devuelve datos del token y la sesión
        API->>API: Genera nuevo Access Token (JWT)
        API->>Database: UPDATE session SET last_access_at = NOW()
        API-->>Client: 200 OK (accessToken)
    else Token Inválido o Revocado
        API-->>Client: 401 Unauthorized (forzar logout)
    end
```
