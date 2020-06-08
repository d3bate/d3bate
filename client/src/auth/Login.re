module LoginUserQuery = [%graphql
  {|
   query($password: String!, $identifier: String!) {
     loginUser(password: $password, identifier: $identifier) {
       token
     }
   }
  |}
];

module GetLoginUserQuery = ReasonApollo.CreateQuery(LoginUserQuery);

[@react.component]
let make = () => {
  let (identifier, setIdentifier) = React.useState(() => "");
  let (password, setPassword) = React.useState(() => "");
  let (dispatchQuery, setDispatchQuery) = React.useState(() => false);
  switch (dispatchQuery) {
  | false =>
    <form onSubmit={_submitEvent => {()}}>
      <div className="flex flex-column">
        <h1 className="ma2 pa2"> {ReasonReact.string("Login.")} </h1>
        <input
          className="br3 b--black ma2 pa2"
          value=identifier
          onInput={e => {setIdentifier(ReactEvent.Form.target(e)##value)}}
          placeholder="Username or email: "
        />
        <input
          value=password
          className="br3 b--black ma2 pa2"
          onInput={e => {setPassword(ReactEvent.Form.target(e)##value)}}
          type_="password"
          placeholder="Password: "
        />
        <input type_="submit" value="Login" className="ma2 pa2" />
      </div>
    </form>
  | true =>
    let loginQuery = LoginUserQuery.make(~identifier, ~password, ());
    <GetLoginUserQuery variables=loginQuery##variables>
      ...{({result}) =>
        switch (result) {
        | Loading => <p> {ReasonReact.string("Loading...")} </p>
        | Error(error) => <div> {ReasonReact.string(error.message)} </div>
        | Data(response) =>
          let _ = Binding.setItem("token", response##loginUser##token);
          <div> <p> {ReasonReact.string("You are logged in.")} </p> </div>;
        }
      }
    </GetLoginUserQuery>;
  };
};