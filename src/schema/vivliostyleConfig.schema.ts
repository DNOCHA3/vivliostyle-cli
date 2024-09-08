/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type VivliostyleConfigSchema =
  | VivliostyleConfigEntry
  | [VivliostyleConfigEntry, ...VivliostyleConfigEntry[]];
export type Theme = string;
export type Entry = string;
export type ThemeSpecifier = Theme | ThemeObject | (Theme | ThemeObject)[];
export type EntryObject =
  | ContentsEntryObject
  | CoverEntryObject
  | ArticleEntryObject;
export type Output = string;
export type BrowserType = 'chromium' | 'firefox' | 'webkit';

export interface VivliostyleConfigEntry {
  /**
   * Title
   */
  title?: string;
  /**
   * Author
   */
  author?: string;
  /**
   * Theme package path(s) or URL(s) of css file.
   */
  theme?: Theme | ThemeObject | (Theme | ThemeObject)[];
  /**
   * Entry file(s) of document.
   */
  entry: Entry | ArticleEntryObject | (Entry | EntryObject)[];
  /**
   * Directory of referencing entry file(s).
   */
  entryContext?: string;
  /**
   * Options about outputs.
   */
  output?: (Output | OutputObject)[] | Output | OutputObject;
  workspaceDir?: string;
  /**
   * @deprecated
   * @deprecated Use 'copyAsset.includes' instead
   */
  includeAssets?: Entry[] | Entry;
  /**
   * Options about asset files to be copied when exporting output.
   */
  copyAsset?: {
    /**
     * Specify directories and files you want to include as asset files. This option supports wildcard characters to make glob patterns.
     */
    includes?: string[];
    /**
     * Specify directories and files you want to exclude from the asset file. This option supports wildcard characters to make glob patterns.
     */
    excludes?: string[];
    /**
     * Specify extensions of the file you want to include as an asset file. (default: [png, jpg, jpeg, svg, gif, webp, apng, ttf, otf, woff, woff2])
     */
    includeFileExtensions?: string[];
    /**
     * Specify extensions of the file you want to exclude as an asset file.
     */
    excludeFileExtensions?: string[];
    [k: string]: unknown;
  };
  /**
   * Output pdf size [Letter]. preset: A5, A4, A3, B5, B4, JIS-B5, JIS-B4, letter, legal, ledger. custom(comma separated): 182mm,257mm or 8.5in,11in.
   */
  size?: string;
  /**
   * Make generated PDF compatible with press ready PDF/X-1a [false]. This option is equivalent with "preflight": "press-ready"
   */
  pressReady?: boolean;
  /**
   * Language
   */
  language?: string;
  readingProgression?: 'ltr' | 'rtl';
  /**
   * Options about Table of Contents (ToC) documents.
   */
  toc?:
    | boolean
    | string
    | {
        /**
         * Specify the title of the generated ToC document.
         */
        title?: string;
        /**
         * Specify the location where the generated ToC document will be saved. (default: index.html)
         */
        htmlPath?: string;
        /**
         * Specify the depth of the section to be included in the ToC document. (default: 0)
         */
        sectionDepth?: number;
        /**
         * Specify the transform function for the document list.
         */
        transformDocumentList?: (
          nodeList: import('@vivliostyle/cli').StructuredDocument[],
        ) => (propsList: { children: any }[]) => any;
        /**
         * Specify the transform function for the section list.
         */
        transformSectionList?: (
          nodeList: import('@vivliostyle/cli').StructuredDocumentSection[],
        ) => (propsList: { children: any }[]) => any;
        [k: string]: unknown;
      };
  /**
   * @deprecated
   * @deprecated Use 'toc.title' instead
   */
  tocTitle?: string;
  /**
   * Options about cover images and cover page documents
   */
  cover?:
    | string
    | {
        /**
         * Specify the cover image to be used for the cover page.
         */
        src: string;
        /**
         * Specify alternative text for the cover image.
         */
        name?: string;
        /**
         * Specify the location where the generated cover document will be saved. (default: cover.html) If falsy value is set, the cover document won't be generated.
         */
        htmlPath?: string | boolean;
        [k: string]: unknown;
      };
  /**
   * Timeout limit for waiting Vivliostyle process [120000]
   */
  timeout?: number;
  /**
   * Option for convert Markdown to a stringify (HTML).
   */
  vfm?: {
    /**
     * Custom stylesheet path/URL.
     */
    style?: string | string[];
    /**
     * Output markdown fragments.
     */
    partial?: boolean;
    /**
     * Document title (ignored in partial mode).
     */
    title?: string;
    /**
     * Document language (ignored in partial mode).
     */
    language?: string;
    /**
     * Replacement handler for HTML string.
     */
    replace?: VfmReplaceRule[];
    /**
     * Add `<br>` at the position of hard line breaks, without needing spaces.
     */
    hardLineBreaks?: boolean;
    /**
     * Disable automatic HTML format.
     */
    disableFormatHtml?: boolean;
    /**
     * Enable math syntax.
     */
    math?: boolean;
    [k: string]: unknown;
  };
  /**
   * Specify a docker image to render.
   */
  image?: string;
  /**
   * Launch an HTTP server hosting contents instead of file protocol. It is useful that requires CORS such as external web fonts.
   */
  http?: boolean;
  /**
   * Specify a URL of displaying viewer instead of vivliostyle-cli's one. It is useful that using own viewer that has staging features. (ex: https://vivliostyle.vercel.app/)
   */
  viewer?: string;
  /**
   * specify viewer parameters. (ex: "allowScripts=false&pixelRatio=16")
   */
  viewerParam?: string;
  /**
   * EXPERIMENTAL SUPPORT: Specify a browser type to launch Vivliostyle viewer. Currently, Firefox and Webkit support preview command only!
   */
  browser?: BrowserType;
  [k: string]: unknown;
}
export interface ThemeObject {
  /**
   * Sepcifier name of importing theme package or a path of CSS file.
   * - A npm-style package argument is allowed (ex: @vivliostyle/theme-academic@1 ./local-pkg)
   * - A URL or a local path of CSS is allowed (ex: ./style.css, https://example.com/style.css)
   */
  specifier: string;
  /**
   * Importing CSS path(s) of the package. Specify this if you want to import other than the default file.
   */
  import?: string | string[];
}
export interface ArticleEntryObject {
  path: string;
  output?: string;
  title?: string;
  theme?: ThemeSpecifier;
  encodingFormat?: string;
  rel?: string | string[];
}
export interface ContentsEntryObject {
  rel: 'contents';
  path?: string;
  output?: string;
  title?: string;
  theme?: ThemeSpecifier;
  /**
   * Specify the page break position before this document. It is useful when you want to specify which side a first page of the document should be placed on a two-page spread.
   */
  pageBreakBefore?: 'left' | 'right' | 'recto' | 'verso';
  /**
   * Reset the starting page number of this document by the specified integer. It is useful when you want to control page numbers when including a cover page.
   */
  pageCounterReset?: number;
}
export interface CoverEntryObject {
  rel: 'cover';
  path?: string;
  output?: string;
  title?: string;
  theme?: ThemeSpecifier;
  imageSrc?: string;
  imageAlt?: string;
  /**
   * Specify the page break position before this document. It is useful when you want to specify which side a first page of the document should be placed on a two-page spread.
   */
  pageBreakBefore?: 'left' | 'right' | 'recto' | 'verso';
}
export interface OutputObject {
  /**
   * Specify output file name or directory [<title>.pdf].
   */
  path: string;
  /**
   * Specify output format.
   */
  format?: string;
  /**
   * if docker is set, Vivliostyle try to render PDF on Docker container [local].
   */
  renderMode?: 'local' | 'docker';
  /**
   * Apply the process to generate PDF for printing.
   */
  preflight?: 'press-ready' | 'press-ready-local';
  /**
   * Options for preflight process (ex: gray-scale, enforce-outline). Please refer the document of press-ready for further information. https://github.com/vibranthq/press-ready
   */
  preflightOption?: string[];
}
export interface VfmReplaceRule {
  test: RegExp;
  match: (result: RegExpMatchArray, h: any) => Object | string;
}
