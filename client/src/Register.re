[@react.component]
let make = () => {
  let (username, setUsername) = React.useState(() => "");
  let (password, setPassword) = React.useState(() => "");
  let (email, setEmail) = React.useState(() => "");
  let (pgp, setPgp) = React.useState(() => "");
  <form onSubmit={e => {ReactEvent.Form.preventDefault(e)}}>
    <div className="flex flex-column">
      <h1 className="ma2 pa2"> {ReasonReact.string("Register.")} </h1>
      <input
        className="br3 b--black ma2 pa2"
        value=username
        placeholder="Username: "
        onInput={e => {setUsername(ReactEvent.Form.target(e)##value)}}
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
        value=email
        placeholder="Email: "
        onInput={e => {setEmail(ReactEvent.Form.target(e)##value)}}
        type_="email"
      />
      <input
        className="br3 b--black ma2 pa2"
        placeholder="[optional] Preferred pronoun(s): "
        value=pgp
        onInput={e => {setPgp(ReactEvent.Form.target(e)##value)}}
      />
      <input type_="submit" value="Register!" className="ma2 pa2" />
    </div>
  </form>;
};