# Swiggy Rituals

Swiggy Rituals is a permission-first AI commerce agent that turns recurring food, grocery, and dining needs into one-tap approvals. The first demo focuses on a weekday lunch ritual: a user asks for healthy lunches under Rs. 300 near office, and the agent searches Swiggy Food, ranks options, stages the best cart, and asks before checkout.

The product is not meant to be a standalone Swiggy clone. It is a chat-first copilot that can live inside Swiggy, WhatsApp, Slack, Teams, or an MCP client.

## Demo Flow

1. User enters: `I want healthy weekday lunches under Rs. 300 near office.`
2. The agent parses budget, diet, timing, and location.
3. The MCP trace reveals Food tool calls step by step.
4. The agent shows ranked lunch options with price, ETA, and reasoning.
5. The user confirms today's order.
6. The same ritual can run every weekday, but checkout always needs approval.

## MCP Servers Needed

- Swiggy Food MCP for restaurant search, menu search, cart updates, checkout, order placement, and tracking.
- Swiggy Instamart MCP for recurring pantry restock rituals.
- Swiggy Dineout MCP for restaurant discovery, slot availability, table booking, and booking status.

Food MCP is required for the first demo. Instamart and Dineout expand the same ritual pattern across Swiggy's broader commerce surfaces.

## Architecture

```text
User intent
  -> AI agent planner
  -> Swiggy MCP tool calls
  -> ranked recommendations / cart draft
  -> explicit user approval
  -> final checkout or booking action
```

The demo currently uses mocked MCP responses in the frontend to show the intended interaction model. In a production integration, a lightweight Node/TypeScript backend would act as the MCP client layer, call Swiggy tools, normalize responses, and return structured options to the agent UI.

## Safety Model

- No checkout or booking without explicit user confirmation.
- Budget, timing, and location are locked per ritual.
- Tool calls are visible in the UI trace.
- The agent can prepare carts and recommendations, but final spend remains user-controlled.

## Tech Stack

- React
- Vite
- lucide-react
- Plain CSS

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173/`.

## Builder Program Positioning

Swiggy Rituals demonstrates how MCP can turn Swiggy from an app users repeatedly operate into an agentic commerce layer that prepares recurring decisions for approval. The first use case is weekday lunch, but the pattern naturally expands to weekly Instamart restocks and planned Dineout reservations.
