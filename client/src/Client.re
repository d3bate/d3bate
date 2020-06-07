let contextHandler = () => {
  let token = Binding.getItem("token");
  let headers = {
    "headers": {
      "x-api-token": token,
    },
  };
  headers;
};

let authLink = ApolloLinks.createContextLink(contextHandler);

let httpLink = ApolloLinks.createHttpLink(~uri="", ());

let inMemoryCache = ApolloInMemoryCache.createInMemoryCache();

let apolloClient =
  ReasonApollo.createApolloClient(
    ~cache=inMemoryCache,
    ~link=ApolloLinks.from([|authLink, httpLink|]),
    (),
  );