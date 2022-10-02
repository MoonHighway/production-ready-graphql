# San Diego API 🌞

For the lab instructions, find the `LAB_INSTRUCTIONS.md` file in this folder.

To use this project, run:

```bash
npm install
npm start
```

See the project running at `localhost:4000`.

Send the following query to test:

```graphql
query CityDetails {
  details {
    avgTemp
    population
    sunshine
  }
}
```
