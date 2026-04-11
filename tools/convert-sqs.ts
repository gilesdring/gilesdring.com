import textLoader from "lume/core/loaders/text.ts";
import { stringify } from "jsr:@std/yaml";
import type { RawData } from "lume/core/file.ts";
import { DOMParser } from "jsr:@b-fuze/deno-dom";
import fs from 'node:fs';

type SquarespaceFrontmatterType = {
    layout: string;
    title: string;
    categories: string[];
    tags: string[]
    status: string;
    type: string;
    published: boolean;
    meta: object;
};

class Post {
    filePath: string;
    #data?: RawData;

    constructor(path: string) {
        this.filePath = path;
    }
    async data(): Promise<RawData> {
        if (!this.#data) {
            const { title, tags, content: rawContent } = await textLoader(this.filePath);
            const content = new DOMParser().parseFromString(rawContent as string, "text/html").querySelector('body')?.innerHTML.trim() || rawContent;
            this.#data = { title, tags, content };
        }
        return this.#data;
    }

    async serialise(): Promise<string> {
        const { content, ...frontmatter } = await this.data();

        const serialised = '---\n' +
            stringify(frontmatter) +
            '---\n' +
            content +
            '\n';
        return serialised;
    }

    async process() {
        fs.writeFileSync(this.filePath, await this.serialise(), "utf-8")
    }
}

// const testFile = "_drafts/2011-10-06-steve-jobs-1955-2011.vto";

const postFile = Deno.args[0];

if (!postFile) throw new Error("No file provided");

console.time(postFile);
await new Post(postFile).process();
console.timeEnd(postFile);
