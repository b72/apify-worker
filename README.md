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
node src/index.js
```


Notes:
- The script can be run using pm2
- Adjust parallelization and error handling based on volume.
