open Css;

let full_height = style([height(pct(100.0))]);

let top_left = style([top(px(5)), left(px(5))]);

let extra_big = style([fontSize(em(2.0))]);

let slide =
  Css.(
    keyframes([
      (0, [transform(translate(pct(-100.0), pct(0.0)))]),
      (100, [transform(translate(pct(0.0), pct(0.0)))]),
    ])
  );

let inline_text = style([verticalAlign(`middle)]);

let navbar_drawer =
  style([
    backgroundColor(hex("f4d03f")),
    boxShadow(Shadow.box(~y=px(3), ~blur=px(5), rgba(0, 0, 0, 0.3))),
    padding(px(15)),
    fontSize(em(1.5)),
  ]);

let navbar_link_of_no_circle =
  style([color(white), textDecoration(none), width(auto)]);

let navbar_link = style([color(white), textDecoration(none), width(auto)]);

let navbar_icon = Css.(merge([top_left, extra_big, inline_text]));

let hide = style([display(none)]);

let navbar =
  style([
    boxShadow(Shadow.box(~y=px(3), ~blur=px(5), rgba(0, 0, 0, 0.3))),
    backgroundColor(grey),
    color(white),
    height(pct(100.0)),
    fontSize(rem(2.0)),
    animationName(slide),
    animationDuration(750),
    zIndex(6),
    position(absolute),
    paddingRight(px(40)),
  ]);

let navbar_list =
  style([display(flexBox), flexDirection(column), listStyleType(none)]);

let navbar_item = style([paddingBottom(px(5))]);