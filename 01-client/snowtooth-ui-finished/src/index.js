import * as ReactDOM from "react-dom/client";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://snowtooth.moonhighway.com",
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
