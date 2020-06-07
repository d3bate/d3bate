// Entry point
ReactDOMRe.renderToElementWithId(
  <ReasonApollo.Provider client=Client.apolloClient>
    <App />
  </ReasonApollo.Provider>,
  "root",
);