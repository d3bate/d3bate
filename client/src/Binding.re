// bindings to `localStorage`
[@bs.val] [@bs.scope "localStorage"] external getItem: string => string;
[@bs.val] [@bs.scope "localStorage"]
external setItem: (string, string) => string;