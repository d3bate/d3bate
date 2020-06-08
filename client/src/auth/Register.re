module RegisterUserQuery = [%graphql
  {|
    mutation($name: String!, $email: String!, $password: String!, $pgp: String!) {
      registerUser(newUser: {
        name: $name,
        email: $email,
        password: $password,
        pgp: $pgp
      }) {
        id,
        name,
        email
      }
    }
  |}
];

module AddUserMutation = ReasonApollo.CreateMutation(RegisterUserQuery);

[@react.component]
let make = () => {
  let (username, setUsername) = React.useState(() => "");
  let (password, setPassword) = React.useState(() => "");
  let (password2, setPassword2) = React.useState(() => "");
  let (email, setEmail) = React.useState(() => "");
  let (pgp, setPgp) = React.useState(() => "");
  <AddUserMutation>
    ...{(mutation, {result}) => {
      <form
        onSubmit={e => {
          ReactEvent.Form.preventDefault(e);
          let addNewUserQuery =
            RegisterUserQuery.make(
              ~name=username,
              ~email,
              ~pgp,
              ~password,
              (),
            );
          let _ = mutation(~variables=addNewUserQuery##variables) |> ignore;
          ();
        }}>
        <div className="flex flex-column">
          <h1 className="ma2 pa2"> {ReasonReact.string("Register.")} </h1>
          <span>
            {switch (result) {
             | NotCalled => "" |> React.string
             | Data(_) => "You have sucessfully registered." |> React.string
             | Error(e) => e.message |> React.string
             | Loading => "Loading..." |> React.string
             }}
          </span>
          <input
            className="br3 b--black ma2 pa2"
            value=username
            placeholder="Username: "
            onInput={e => {setUsername(ReactEvent.Form.target(e)##value)}}
          />
          <input
            className="br3 b--black ma2 pa2"
            value=email
            placeholder="Email: "
            onInput={e => {setEmail(ReactEvent.Form.target(e)##value)}}
            type_="email"
          />
          <input
            className="br3 b--black ma2 pa2"
            value=password
            placeholder="Password: "
            onInput={e => {setPassword(ReactEvent.Form.target(e)##value)}}
            type_="password"
          />
          <input
            className="br3 b--black ma2 pa2"
            value=password2
            placeholder="Password confirmation: "
            onInput={e => {setPassword2(ReactEvent.Form.target(e)##value)}}
            type_="password"
          />
          <input
            className="br3 b--black ma2 pa2"
            placeholder="[optional] Preferred pronoun(s), comma separated: "
            value=pgp
            onInput={e => {setPgp(ReactEvent.Form.target(e)##value)}}
          />
          <input type_="submit" value="Register!" className="ma2 pa2" />
        </div>
      </form>
    }}
  </AddUserMutation>;
};