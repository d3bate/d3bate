[@react.component]
let make = () => {
  let (show, setShow) = React.useState(() => false);
  show
    ? <nav className=Styles.navbar>
        <ul className=Styles.navbar_list>
          <a
            href="#"
            className=Styles.navbar_link
            onClick={_ => setShow(_ => false)}>
            <span className={Styles.navbar_icon ++ " material-icons"}>
              {ReasonReact.string("close")}
            </span>
            {ReasonReact.string(" close")}
          </a>
          <h2> {ReasonReact.string("d3bate")} </h2>
          <hr />
          <li className=Styles.navbar_item> {ReasonReact.string("Home")} </li>
          <li className=Styles.navbar_item>
            {ReasonReact.string("Clubs")}
          </li>
          <li className=Styles.navbar_item>
            {ReasonReact.string("Calendar")}
          </li>
          <li className=Styles.navbar_item>
            {ReasonReact.string("Account")}
          </li>
        </ul>
      </nav>
    : {
      <div className=Styles.navbar_drawer>
        <a
          href="#"
          className=Styles.navbar_link_of_no_circle
          onClick={_ => setShow(_ => true)}>
          <span className={"material-icons " ++ Styles.inline_text}>
            {ReasonReact.string("menu")}
          </span>
          {ReasonReact.string("d3bate")}
        </a>
      </div>;
    };
};