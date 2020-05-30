type appState = {
  jwt: string,
  identifier: string,
  password: string,
};

type appAction =
  | ReceiveJWT(string)
  | ReceiveLogin(string, string);

let appReducer = (state, action) =>
  switch (action) {
  | ReceiveJWT(jwt) => {...state, jwt}
  | ReceiveLogin(i, p) => {...state, identifier: i, password: p}
  };

let appStore =
  Reductive.Store.create(
    ~reducer=appReducer,
    ~preloadedState={jwt: "", identifier: "", password: ""},
    (),
  );