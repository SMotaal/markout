﻿//@ts-check

/// <reference lib="dom" />

import * as flags from './flags.js';
import * as dom from './dom.js';
import * as dom_normalizer from './dom/normalizer';
import * as dom_renderer from './dom/renderer';
import * as markup from './markup.js';
import * as exports from './content.js';
import {Selectors} from './helpers';

declare module './content' {
  export namespace content {
    export const {MarkupAttributeMap, renderSourceText} = markup;
    export const {AssetNodeSelector, AssetNodeMap, populateAssetsInFragment, flattenTokensInFragment} = dom;

    export const {
      normalizeRenderedFragment,
      populateAssetsInFragment,
      normalizeBreaksInFragment,
      normalizeHeadingsInFragment,
      normalizeChecklistsInFragment,
      normalizeParagraphsInFragment,
      normalizeDeclarativeStylingInFragment,
    } = dom_normalizer;

    export const {
      createRenderedFragment,
      renderURLExpansionLinksInFragment,
      renderSourceTextsInFragment,
    } = dom_renderer;

    export {Fragment};
  }

  export * from './content.js';
}

declare module './content.js' {
  export * from './content';
}

// export {content} from './content';

export interface Fragment extends DocumentFragment {
  fragment?: this;
  baseURL?: string;
  sourceText?: string;
  normalizedText?: string;
  tokens?: any;
  renderedText?: string;
  markoutContentFlags?: Fragment.Flags;
  assets?: Fragment.Assets;
  headings?: Fragment.Headings;
  instantiated?: Promise<this>;
}

export namespace Fragment {
  export interface BlockQuote extends HTMLQuoteElement {
    dataset: super['dataset'] & {headingNumber?: number};
    blockHeadingNode: HTMLSpanElement;
    blockBody?: string;
    blockHeading?: string;
    blockHeadingSeparator?: string;
    blockquoteLevel?: number;
    parentElement: super['parentElement'] | BlockQuote;
  }

  export interface Heading extends HTMLHeadingElement {
    anchor?: Headings[string];
    dataset: super['dataset'] & {headingNumber?: number};
  }
  export interface Anchor extends HTMLAnchorElement {
    heading?: Headings[string];
  }

  export interface Headings {
    [name: string]: {anchor: Anchor; identity: string; heading: Heading; level: number; number: number};
  }

  export type LinkElement =
    | HTMLLinkElement
    | HTMLScriptElement
    | HTMLImageElement
    | HTMLSourceElement
    | HTMLVideoElement;

  export interface Link extends LinkElement, HTMLElement {
    // [name: T]: string | null;
    type: string;
    attributes: LinkAttributes;
  }

  export interface LinkAttributes extends NamedNodeMap, Partial<Record<'base' | 'href' | 'src' | 'srcset', Attr>> {}

  export interface Links<T extends Link = Link> extends Array<T> {}
  export type Flags = {[K in string]: K extends keyof flags ? typeof flags[K] : unknown};
  export interface Assets extends Links {
    modules?: Links<HTMLScriptElement>;
    scripts?: Links<HTMLScriptElement>;
    stylesheets?: Links<HTMLStyleElement>;
    images?: Links<HTMLImageElement>;
    sources?: Links<HTMLSourceElement>;
    videos?: Links<HTMLVideoElement>;
    undefined?: Links;
    // [name: string]: Links;
  }
}

declare global {
  interface ParentNode {
    /**
     * Returns the first element that is a descendant of node that matches selectors.
     */
    querySelector(selectors: Selectors): HTMLElement | null;
    // querySelector<E extends Element = Element>(selectors: string): E | null;
    /**
     * Returns all element descendants of node that match selectors.
     */
    querySelectorAll(selectors: Selectors): NodeListOf<HTMLElement>;
    // querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
  }

  interface HTMLElement {
    sourceText?: string;
  }
  interface HTMLLinkElement {
    nodeName: 'LINK';
  }
  interface HTMLScriptElement {
    nodeName: 'SCRIPT';
  }
  interface HTMLStyleElement {
    nodeName: 'STYLE';
  }
  interface HTMLImageElement {
    nodeName: 'IMG' | 'IMAGE';
  }
  interface HTMLSourceElement {
    nodeName: 'SOURCE';
  }
  interface HTMLVideoElement {
    nodeName: 'VIDEO';
  }
}
