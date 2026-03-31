# MetaLend Public API & Frontend Generator

OpenAPI specification for the **MetaLend Rebalancing API** — a cross-protocol, cross-chain DeFi rebalancing platform supporting deposits, withdrawals, rewards, pool management, and user configuration across protocols like Aave, Morpho, Euler, and more.

## Repository Contents

| File | Purpose |
|---|---|
| `openapi.yaml` | OpenAPI 3.0.3 specification — the single source of truth for all backend endpoints |
| `CLAUDE.md` | AI code-generation instructions for building a complete production frontend from the spec |

## API Overview

Base URL: `https://api.metalend.tech`

All endpoints require an `X-API-Key` header. Authenticated operations (deposits, withdrawals, config updates) additionally require a JWT obtained through the challenge/verify auth flow.

**Get your API key** at [developer.metalend.tech](https://developer.metalend.tech/).

### Endpoint Groups

- **Auth** — challenge/verify flow for JWT issuance
- **Project Settings** — fetch project-level default configuration
- **User Configuration** — register or update per-wallet rebalancer settings
- **Deposits** — create deposit intents, track status
- **Withdrawals** — submit signed withdrawal requests, monitor status
- **Balances** — query wallet balances and bridge-in-progress amounts
- **Rewards** — aggregated rewards and claim details
- **Pools** — list protocols, pools, APY breakdowns, TVL snapshots
- **Transaction Costs** — deposit/withdraw fees and minimums per chain

## Generating a Frontend with AI

The `CLAUDE.md` file contains structured instructions that guide AI coding assistants (Claude, Cursor, or similar) through building a complete, production-ready React frontend from the OpenAPI spec.

### How It Works

`CLAUDE.md` is loaded automatically as a workspace rule when using Cursor. For other tools, feed it as a system prompt or project instruction file alongside `openapi.yaml`.

The instructions enforce a strict lifecycle:

```
READ → PLAN → VERIFY → BUILD → SELF-CHECK
```

The AI will:

1. **Analyze** every endpoint in `openapi.yaml` and extract schemas
2. **Design** the domain model, feature map, and architecture
3. **Generate** a typed API client from the spec (using `openapi-typescript`)
4. **Build** the full React + TypeScript + Vite + TailwindCSS application
5. **Self-check** that every endpoint is covered and the project compiles


### Quick Start with Claude Code (CLI)

```bash
# From the repository root
claude

# Then prompt:
# "Build the complete MetaLend frontend application from the OpenAPI spec."
```

Claude Code automatically reads `CLAUDE.md` and follows the instructions.

### Quick Start with Any AI Assistant

Provide both files as context and use a prompt like:

```
Using the attached OpenAPI specification (openapi.yaml) and the instructions
in CLAUDE.md, build a complete production-ready frontend for the MetaLend
cross-chain staking platform.

Tech stack: React, TypeScript (strict), Vite, TailwindCSS, wagmi, viem.
Generate all API types from the spec — do not manually define them.
```

### What Gets Generated

The output is a full project with this structure:

```
src/
  api/          # Generated types, API client, interceptors
  features/     # Pools, deposits, withdrawals, rewards
  components/   # Shared UI components
  hooks/        # Custom React hooks
  providers/    # React context providers (wallet, query, toast)
  lib/          # Web3 config (wagmi/viem), utilities
  types/        # Shared TypeScript types
  pages/        # Route-level page components
```

Key capabilities:

- Typed API client generated from the OpenAPI spec
- Wallet connection (MetaMask, WalletConnect) via wagmi/viem
- Chain validation before every transaction
- On-chain token balance fetching (ERC20 `balanceOf`)
- Full deposit flow (approve → wait for confirmation → deposit)
- Withdrawal flow with API-sourced positions
- Pool browsing and configuration management
- Project Settings vs User Config distinction
- Global error boundaries, toast notifications, loading/error states

## Resources

- [Developer Portal (API Keys)](https://developer.metalend.tech/)
- [API Documentation](https://api.metalend.tech) 
- [Litepaper](https://metalend-inc.gitbook.io/litepaper)
- [Terms of Service](https://metalend-inc.gitbook.io/litepaper/terms-of-service)
- [Support](mailto:support@metalend.tech)

## License

Proprietary. See terms of service for details.
