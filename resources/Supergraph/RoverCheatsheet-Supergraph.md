# Supergraphs with Rover CLI

## Installing and Using the Router

1. In a folder, run the curl command to install.

```bash
curl -sSL https://router.apollo.dev/download/nix/latest | sh
```

To check that it is installed, run the following command:

```bash
./router
```

## Publishing a Schema

```bash
rover subgraph publish YOUR_GRAPH_REF \
  --routing-url https://snowtooth-mountain-lifts.herokuapp.com/ \
  --schema ./lifts-schema.graphql \
  --name lifts
```

## Checking a Schema

```bash
rover subgraph check YOUR_GRAPH_REF \
  --routing-url https://snowtooth-mountain-lifts.herokuapp.com/ \
  --schema ./lifts-schema.graphql \
  --name lifts
```
