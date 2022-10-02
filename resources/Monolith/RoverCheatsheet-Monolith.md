# Rover CLI

Here are some common commands that you'll use with the Rover CLI.

## Installing the Rover CLI

```bash
curl -sSL https://rover.apollo.dev/nix/latest | sh
```

## Authenticating with Rover

```bash
rover config auth
```

Once you run this, you'll paste your API Key!

```bash
rover config whoami
```

## Schema Checking

```bash
rover graph check my-graph@current --schema ./typeDefs.graphql
```

## Schema Publishing

```bash
rover graph publish my-graph@current --schema ./typeDefs.graphql
```
