export {
    Config
}


type Method = "post" | "get";

interface Paging {
  enabled: boolean;
  position: number;
  startValue: number;
  limitValue: number;
  isNextPage: boolean;
}

interface Config {
  url: string;
  key: string;
  body: string;
  method: Method;
  paging: Paging;
}
