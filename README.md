Node microservice to send links from the `links` table to Apify and write results to `tasks`.

Usage:

1. Install dependencies

```bash
cd crawler
npm install
```

2. Create `.env` (copy from `.env.example`) and set DB and `APIFY_TOKEN`.

3. Run the service:

- Process all links:

```bash
node index.js
```

- Process a single link by id:

```bash
node index.js --link-id=123
```

- Process all links with a batch id:

```bash
node index.js --batch-id=5
```

- Process a single URL (without DB):

```bash
node index.js --url="https://www.facebook.com/somepage"
```

Notes:
- The script inserts a `tasks` row with `status` set to `started` and updates it to `completed` or `failed` after the Apify response.
- Adjust parallelization and error handling based on volume.
