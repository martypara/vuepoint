import type { Plugin } from "vite";
import { normalizePath } from "vite";
import { ElementTypes, NodeTypes } from "@vue/compiler-dom";
import { parse } from "@vue/compiler-sfc";

const VUE_FILE_RE = /\.vue$/;
const PLUGIN_META = '<meta name="vuepoint-vite-plugin" content="true">';

interface SourceLocationNode {
  type: number;
  loc: {
    start: {
      line: number;
      column: number;
      offset: number;
    };
  };
  tag?: string;
  tagType?: ElementTypes;
  children?: SourceLocationNode[];
  branches?: Array<{ children: SourceLocationNode[] }>;
}

interface Insertion {
  index: number;
  text: string;
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function createLocationValue(filename: string, line: number, column: number): string {
  const normalizedFilename = normalizePath(filename);
  const normalizedRoot = normalizePath(process.cwd()).replace(/\/$/, "");
  const relativeFilename = normalizedFilename.startsWith(`${normalizedRoot}/`)
    ? normalizedFilename.slice(normalizedRoot.length + 1)
    : normalizedFilename;

  return `${relativeFilename}:${line}:${column}`;
}

function collectInsertions(node: SourceLocationNode, filename: string, insertions: Insertion[]): void {
  if (node.type === NodeTypes.ELEMENT && node.tag && node.tagType === ElementTypes.ELEMENT) {
    const location = createLocationValue(filename, node.loc.start.line, node.loc.start.column);
    insertions.push({
      index: node.loc.start.offset + node.tag.length + 1,
      text: ` data-vuepoint-loc="${escapeAttribute(location)}"`,
    });
  }

  node.children?.forEach((child) => {
    collectInsertions(child, filename, insertions);
  });

  node.branches?.forEach((branch) => {
    branch.children.forEach((child) => {
      collectInsertions(child, filename, insertions);
    });
  });
}

function applyInsertions(source: string, insertions: Insertion[]): string {
  if (insertions.length === 0) return source;

  let output = source;
  [...insertions]
    .sort((left, right) => right.index - left.index)
    .forEach((insertion) => {
      output = `${output.slice(0, insertion.index)}${insertion.text}${output.slice(insertion.index)}`;
    });

  return output;
}

export function vuepoint(): Plugin {
  return {
    name: "vuepoint:vite",
    apply: "serve",
    enforce: "pre",
    transform(code, id) {
      if (!VUE_FILE_RE.test(id)) return null;
      if (id.includes("?")) return null;
      if (id.includes("/node_modules/")) return null;

      const { descriptor } = parse(code, { filename: id });
      if (!descriptor.template?.ast) return null;

      const insertions: Insertion[] = [];
      collectInsertions(descriptor.template.ast as unknown as SourceLocationNode, id, insertions);

      if (insertions.length === 0) return null;

      return {
        code: applyInsertions(code, insertions),
        map: null,
      };
    },
    transformIndexHtml(html) {
      if (html.includes(PLUGIN_META)) return html;
      return html.replace(/<head([^>]*)>/i, `<head$1>\n    ${PLUGIN_META}`);
    },
  };
}

export default vuepoint;
