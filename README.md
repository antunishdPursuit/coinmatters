# CoinMatters

CoinMatters helps shoppers compare grocery prices across nearby stores. A
user builds a grocery list, enters a ZIP code, and sees which store has each
item for less. This repository is the React frontend; the data comes from the
[CoinMatters API](https://github.com/antunishdPursuit/Coinmatters-backened).

## Credits

CoinMatters began as a team capstone project built by **Irwin Jorge**,
**Noni Porter** and **Dennys Antunish**, with **Lakisha Johnson**, who
shaped the initial layout and contributed code. Tech mentor **Will
Dickerson** helped design the data model, and design mentor **Dillon
Eversman** guided the page layout. This copy continues that work: it moves
the app to Vite, rebuilds every page to a new design, and adds automated
tests.

## What it does

- **Home** introduces the app and starts a search.
- **Search** takes a list of items and a ZIP code, then shows what the list
  costs at each nearby store, with the best deal marked.
- **My lists** shows a logged-in user's saved lists. Each one can be
  compared, edited or deleted.
- **New list** builds a list by picking from a shelf of items the stores
  stock, or by typing your own.
- **Account** holds the Log in and Register forms side by side.
- **About** introduces the team.

The pages share one visual theme in `src/index.css`. Its tokens come from
Dennis's design system.

## Requirements

- Node.js 22.12 or newer (tested on Node 24)
- The CoinMatters API running locally (see its README)

## Run it locally

1. Install the dependencies.

   ```bash
   npm install
   ```

2. Create `.env.local` with the API's address. With the API's default
   settings, that is:

   ```bash
   VITE_API_URL=http://127.0.0.1:3013
   ```

3. Start the app, then open http://127.0.0.1:3220. The API only accepts
   requests from this address, so keep the port as is.

   ```bash
   npm start
   ```

The API's sample data includes a login for trying the app locally:
`testuser@example.com` with the password `password123`.

## Tests

```bash
npm test
```

The tests run in a simulated browser and don't need the API.

## Build

```bash
npm run build
```

The finished site goes in `dist/`. `npm run preview` serves it on the same
address as above.
