import { UrlObject } from 'url';
import { NextRouter } from 'next/router';

export class ChainableRouter {
  private url: UrlObject;

  constructor(public originalRouter: NextRouter) {}

  create() {
    this.url = {
      pathname: this.originalRouter.pathname,
      query: this.originalRouter.query,
    };
    return this;
  }

  addQuery(query: { [key: string]: string }) {
    Object.entries(query).forEach(([k, v]) => {
      this.url.query[k] = v.toString();
    });
    return this;
  }

  setQuery(query: { [key: string]: string }) {
    this.url.query = query;
    return this;
  }

  setPath(pathname: string) {
    this.url.pathname = pathname;
    return this;
  }

  push() {
    return this.originalRouter.push(this.url, null, {
      unstable_skipClientCache: true,
    });
  }
}
