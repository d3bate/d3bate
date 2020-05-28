type url = {
  path: list(string),
  hash: string,
  search: string,
};

[@react.component]
let make = () => {
  let url = ReasonReactRouter.useUrl();
  switch (url.path) {
  | [] =>
    (
      () => {
        <div className=Styles.full_height> <Navbar /> </div>;
      }
    )()
  | _ =>
    (
      () => {
        <h1> {ReasonReact.string("Not found.")} </h1>;
      }
    )()
  };
};