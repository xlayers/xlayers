import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class FormatService {
  indent(n: number, content: string) {
    const indentation = !!n ? "  ".repeat(n) : "";
    return indentation + content;
  }

  indentFile(n: number, contents: string) {
    return contents.split("\n").map(line => this.indent(n, line));
  }

  capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  snakeName(name: String) {
    return name
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\.?([A-Z]+)/g, (_x, y) => "_" + y.toLowerCase())
      .replace(/^_/, "");
  }
}
