interface IObjectAny {
  [key: string]: any;
}

interface Microblink {
  SDK: IObjectAny;
}

interface Window {
  Microblink: Microblink;
}

declare namespace JSX {
  interface IntrinsicElements {
    'microblink-ui-web': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
