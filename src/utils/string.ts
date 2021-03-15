export {}

declare global {
  interface String {
    isEmpty(this: String): boolean;
  }
}

if(String.prototype.isEmpty === undefined) {
  Object.defineProperty(String.prototype, "isEmpty", {
    enumerable: false,
    writable: true,
    value: isEmpty
  });
}

function isEmpty(this: string): boolean {
  return this.trim() == "";
}
