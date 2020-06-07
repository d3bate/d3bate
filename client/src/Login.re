[@react.component]
let make = () => {
  let (identifier, setIdentifier) = React.useState(() => "");
  let (password, setPassword) = React.useState(() => "");
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
  </div>;
};