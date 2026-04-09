You are a senior frontend architect and blockchain engineer.

Your task is to build a COMPLETE production-ready frontend for the **MelaLend cross-chain staking platform** using the OpenAPI specification located in the project folder.

The OpenAPI specification is the **ONLY SOURCE OF TRUTH** for backend functionality.
**Focus only on `openapi.yaml`** — ignore all other files in this workspace.

Never invent endpoints, fields, or behaviors not defined in the specification.

All blockchain interactions must be implemented using:

* wagmi
* viem

The output must contain **real production code that compiles successfully**.

The application must build using:

* React
* TypeScript (strict mode)
* Vite
* TailwindCSS

---

## CORE EXECUTION MODEL

You must follow the development lifecycle below:

READ → PLAN → VERIFY → BUILD → SELF-CHECK

You MUST NOT skip any phase.

Implementation must **NOT begin until analysis and planning are complete**.

---

## GLOBAL RULES

1. The OpenAPI specification is the **single source of truth**.
2. Never invent endpoints or fields.
3. Never implement features that are not defined in the spec.
4. Every endpoint defined in the specification must be reachable from the UI where logically applicable.
5. All request and response types must be **generated from the OpenAPI specification**.
6. No pseudocode — only real implementation code.
7. All async operations must include:

   * loading states
   * error states
   * retry logic when safe
8. No silent failures.

---

## STEP 1 — SEQUENTIAL OPENAPI ANALYSIS

Read the OpenAPI specification **endpoint-by-endpoint**.

Process the file sequentially and extract details for each endpoint individually.

If the specification is large, process it in multiple passes until every endpoint has been extracted.

For each endpoint extract:

• HTTP method
• path
• description
• parameters
• request body schema
• response schema
• error responses
• authentication requirements

Document results in a structured table:

Method | Endpoint | Description | Request Schema | Response Schema | Errors | Auth

Do NOT summarize yet.

Continue until **every endpoint is fully extracted**.

---

## STEP 2 — DOMAIN MODEL EXTRACTION

From the extracted endpoints derive the domain model.

Identify entities such as:

• pools
• tokens
• chains
• positions
• rewards
• deposits
• withdrawals

For each entity determine:

• attributes
• relationships
• which endpoints interact with it.

---

## STEP 3 — FEATURE MAPPING

Map each endpoint to frontend functionality.

Create a mapping:

Endpoint → UI Feature → Required State → Blockchain Interaction

Classify endpoints as:

• Query (GET)
• Mutation (POST / PUT / PATCH / DELETE)

---

## API KEY
Valid API key is crucial for authentication.

If missing API key is detected or there are 401 api responses, display banner with link where to request API key.  

This link can also be found in `openapi.yaml`.


## CONFIGURATION UI RULE — PROJECT SETTINGS VS USER CONFIG

The UI must clearly distinguish between:

1. **All available pools** (global catalog)
2. **Project Settings** (recommended default configuration for the project bound to API key)
3. **User Config** (user-signed token configuration)
4. **Effective User Config** (final user view after applying Project Settings + User Config rules)

Source of truth:

• `GET /v1/pools` → returns **ALL available pools** across chains and protocols  
• `GET /v1/projects/settings/tokens` → returns **Project Settings** for the API key's project
• `GET /v1/config/{walletAddress}` → returns **the user's current configuration**

The UI must:

• load all pools from `/v1/pools`
• load Project Settings from `/v1/projects/settings/tokens`
• load User Config from `/v1/config/{walletAddress}`
• visually indicate which pools are **selected vs not selected**

Rules for config relation:

• **Project Settings** are defined by the developer as recommended defaults per project (API key scope).
• For a new user without signed token config (`hasSignedConfig = false`), treat Project Settings as the default displayed config.
• For an existing user with signed token config (`hasSignedConfig = true`), always show the user's signed settings and compute **Effective User Config** against Project Settings.
• If overlapping user-signed configuration violates current Project Settings (for example pools removed by developer, or stricter safety filters like TVL/liquidity), at minimum this should be displayed to user as a clear Project Settings difference/violation difference so the user can understand what changed and decide if he will obey the default Project settings or not.
• Signed user configuration must not be silently overwritten by updated Project Settings.

Users must be able to:

• select pools
• deselect pools
• modify their configuration before saving

The configuration arrays must always stay synchronized:

- `domainIds[]`
- `protocolIds[]`
- `poolAddresses[]`

These arrays are derived **only from the selected pools in the UI**.

Users must **never manually input pool addresses**.

All selections must originate from the `/v1/pools` endpoint.

### Collateral exposure (`collateralExposure`) — how the UI must work

When the user configures **`collateralExposure`** (optional list on user config / related flows in `openapi.yaml`):

1. **Source of allowed choices (catalog)**  
   Do **not** let users type arbitrary token symbols. Build the **choice set** from the **pool catalog**: call **`GET /v1/pools`** and **collect every collateral symbol** that appears on pools (each pool may expose collateral exposure / underlying collateral metadata per the spec). **Union** those symbols across all pools, then **deduplicate** into a **single sorted list of unique strings** (e.g. uppercase for display consistency). That list is what the user **selects from** (multi-select checkboxes, chips, etc.).

2. **What gets saved**  
   The value persisted in **`collateralExposure`** must be:
   - **Only** symbols taken from that catalog-driven set (so they correspond to collateral the system knows about via pools / backend tracking).
   - **Uniqueness**: **no duplicate** entries in the array (the API rejects duplicates).
   - **No empty strings** (the API rejects blank entries).
   - **`null` / omit** means the filter is **disabled**; an **empty array `[]`** is **invalid** — use **`null`** to turn the filter off.

3. **Why**  
   The backend validates collateral symbols against **tracked** exposure and structural rules (non-empty if present, max length, uniqueness). The UI should **prevent** invalid selections instead of relying on errors, by deriving options from **`/v1/pools`** and enforcing a deduped selection.

4. **Relation to pool selection**  
   Pool selection (`domainIds` / `protocolIds` / `poolAddresses`) still comes **only** from selected rows in `/v1/pools`. **Collateral exposure** is a **separate** filter list: options are **aggregated from pool metadata**, not hand-typed.

## STEP 4 — FRONTEND ARCHITECTURE

Design the application architecture derived strictly from the API.

Required project structure:

/src
/api
/generated
/client
/interceptors
/features
/pools
/deposits
/withdrawals
/rewards
/components
/hooks
/providers
/lib
/web3
/utils
/types
/pages

Architecture must include:

• TanStack React Query
• Feature-based architecture
• Global error boundaries
• Global toast notification system
• Wallet provider abstraction
• Typed API services

Every endpoint must be reachable from the UI where logically applicable.

---

## STEP 5 — API CLIENT GENERATION

Generate a fully typed API client directly from the OpenAPI specification.

Allowed tools:

• openapi-typescript
OR
• openapi-generator

Rules:

• NEVER manually define request or response types
• Types must come directly from generated definitions

Implement a centralized API layer including:

• Api key `requested from link specified in openapi.yaml`
• Base URL from environment variables
• Typed fetch wrapper
• Request interceptors
• Response interceptors
• Typed error parsing
• Timeout handling
• Network error handling
• Automatic JSON parsing

---

## STEP 6 — USER CONFIGURATION & ENVIRONMENT SETUP

The application must support **user and environment configuration**.

Define a configuration system including:

Environment variables:

VITE_API_KEY
VITE_API_BASE_URL
VITE_DEFAULT_CHAIN
VITE_WALLETCONNECT_PROJECT_ID

Optional runtime configuration:

• supported chains
• contract addresses per chain
• pool configuration
• feature flags

Provide:

• `.env.example`
• configuration loader
• typed config object

Configuration must be validated at startup.

---

## STEP 7 — WEB3 INTEGRATION

Implement blockchain support using:

• wagmi
• viem

Support wallets:

• MetaMask
• WalletConnect

Implement:

• wallet connection UI
• wallet disconnect
• wallet state provider
• wallet error handling

---

## CRITICAL CHAIN VALIDATION

The frontend MUST enforce correct network usage.

Chain validation must occur:

• immediately after wallet connection
• before every blockchain read
• before every blockchain transaction
• when interacting with a pool tied to a specific chain

If the wallet is connected to the wrong network:

• automatically request chain switching
• block transactions until correct chain is selected
• display UI feedback explaining the required network

Transactions must **never execute on the wrong chain**.

---

## STEP 8 — TOKEN BALANCE LOGIC

Token balances MUST be fetched directly from the blockchain.

Use:

ERC20.balanceOf via viem.

Balances are required for:

• deposit screen
• token selector
• deposit validation

Balances must NOT rely on the API.

---

## STEP 9 — DEPOSIT FLOW

Deposit flow must implement:

1. **chain selection** — user selects the chain to deposit on (only chains that have at least one pool in the user's config; the backend chooses which pool on that chain).
2. token selection
3. on-chain balance retrieval
4. amount input
5. allowance check
6. approval transaction
7. WAIT until approval is confirmed on-chain
8. deposit transaction (backend auto-routes to the chosen pool on the selected chain)
9. wait for confirmation

UI must support:

• pending transaction states
• confirmations
• failures
• retry logic

Deposit must **NOT execute until approval confirmation is complete**.

---

## STEP 10 — WITHDRAW FLOW

Withdrawable balances must come from the API.

Withdraw page must:

• fetch positions
• display withdrawable balances
• allow withdrawal
• display pending states
• handle transaction errors

---

## STEP 11 — QUERY AND MUTATION MANAGEMENT

All GET endpoints:

• implemented using TanStack Query
• cached
• loading states
• error states

All mutation endpoints:

• loading indicators
• disabled UI during execution
• retry logic when safe
• full error handling

---

## STEP 12 — GLOBAL ERROR HANDLING

The application must include:

• missing API key or 401 api response detection - display banner with link where to request API key
• global React ErrorBoundary
• centralized API error parser
• toast notification system

Toasts must handle:

• success
• errors
• blockchain transaction confirmation

No unhandled promises allowed.

---

## STEP 13 — IMPLEMENTATION

Begin implementation ONLY after:

• endpoint extraction
• architecture design
• feature mapping

Provide:

1. full project folder structure
2. generated API client setup
3. React providers
4. Web3 configuration
5. React Query configuration
6. Pool list UI
7. Pool selection UI
8. Deposit flow
9. Withdraw flow
10. error handling utilities
11. toast notification system
12. environment configuration
13. setup instructions
14. run instructions

The project MUST compile and run successfully.

---

## STEP 14 — SELF-CHECK

Before finalizing the output perform a verification step.

Confirm:

• every OpenAPI endpoint is implemented or mapped
• no API types were manually defined
• blockchain calls use wagmi + viem
• chain validation exists before transactions
• all async calls handle errors

If something is missing, fix it before producing the final output.

---

## FINAL RULES

Do NOT:

• skip endpoints
• hallucinate API fields
• partially implement flows
• generate pseudocode
• manually define API types

All functionality must strictly originate from the OpenAPI specification.

