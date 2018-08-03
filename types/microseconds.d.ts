declare module "microseconds" {
  interface Parsed {
    microseconds: number,
    milliseconds: number,
    seconds: number,
    minutes: number,
    hours: number,
    days: number,
    toString(): string,
  }
  function now(): number;
  function parse(nano: number): Parsed;
  function since(nano: number): number;
}