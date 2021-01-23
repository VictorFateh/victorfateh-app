export {}

declare global {
  interface Array<T> {
    padEnd(maxLength: number, value: T): T[];
    padEnd(maxLength: number, value: (index: number) => T): T[];
    first(): T | undefined;
    last(): T | undefined;
  }
}

if(Array.prototype.padEnd === undefined) {
  Object.defineProperty(Array.prototype, "padEnd", {
    enumerable: false,
    writable: true,
    value: padEnd
  });
}

if(Array.prototype.first === undefined) {
  Object.defineProperty(Array.prototype, "first", {
    enumerable: false,
    writable: true,
    value: first
  });
}

if(Array.prototype.last === undefined) {
  Object.defineProperty(Array.prototype, "last", {
    enumerable: false,
    writable: true,
    value: last
  });
}

function padEnd<T>(this: Array<T>, maxLength: number, value: (index: number) => T | T): T[] {
  const delta = maxLength - this.length;
  if(delta > 0) {
    if(typeof value !== "function")
      for(let i = this.length; i < delta; i++)
        this.push(value);
    else 
      for(let i = this.length; i < delta; i++)
        this.push(value(i));
  }
  return this;
}

function first<T>(this: Array<T>): T | undefined {
  return this.length === 0 ? undefined : this[0];
}

function last<T>(this: Array<T>): T | undefined {
  return this.length === 0 ? undefined : this[this.length - 1];
}
