import { type CheerioAPI, load } from 'cheerio';
import type { Endpoint, Payload, PayloadRequest } from 'payload';
import { headersWithCors } from 'payload';

import { Role, hasRole } from '@/payload/access';

export interface UrlMetadataResponse {
  title: string;
  description: string;
  image: string;
  published: string;
  site: string;
}

function extractMetaContent($: CheerioAPI, selectors: string[]): string {
  for (const selector of selectors) {
    const element = $(selector);

    if (element.length) {
      const content = element.attr('content') ?? element.first().text();

      if (content) {
        return content.trim();
      }
    }
  }

  return '';
}

async function fetchMetadata(url: string, payload: Payload): Promise<UrlMetadataResponse> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = load(html);

    const domain = new URL(url).hostname;
    const site = extractMetaContent($, ['meta[property="og:site_name"]']) || domain;

    const title = extractMetaContent($, [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'title',
    ]);
    const description = extractMetaContent($, [
      'meta[property="og:description"]',
      'meta[name="description"]',
      'meta[name="twitter:description"]',
    ]);
    const image = extractMetaContent($, [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'link[rel="image_src"]',
    ]);
    const published = extractMetaContent($, [
      'meta[property="article:published_time"]',
      'time[pubdate]',
      'meta[name="published_date"]',
    ]);

    return {
      title,
      description,
      image,
      published,
      site,
    };
  } catch (error) {
    payload.logger.error({ err: error, msg: `Error fetching metadata for ${url}` });
    throw error;
  }
}

function createResponse(body: any, status: number, req: PayloadRequest): Response {
  return Response.json(body, {
    status,
    headers: headersWithCors({ headers: new Headers(), req }),
  });
}

function handleError(error: unknown, url: string, payload: Payload, req: PayloadRequest): Response {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  payload.logger.error({ err: error, msg: `Fetch Metadata Error for ${url || 'unknown URL'}: ${errorMessage}` });

  return createResponse({ error: `Failed to fetch metadata: ${errorMessage}` }, 500, req);
}

export const urlMetadataEndpoint: Endpoint = {
  path: '/url-metadata',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const { payload, user } = req;

    if (!user || !hasRole(Role.Admin)({ req })) {
      payload.logger.warn('Fetch Metadata: Unauthorized access attempt.');

      return createResponse({ error: 'Unauthorized' }, 401, req);
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const body = req.json ? await req.json() : {};
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { url } = body;

      if (!url || typeof url !== 'string') {
        return createResponse({ error: 'URL required' }, 400, req);
      }

      payload.logger.info(`Fetching metadata for URL: ${url} (User: ${user.id})`);

      const metadata = await fetchMetadata(url, payload);

      return createResponse(metadata, 200, req);
    } catch (error: unknown) {
      return handleError(error, '', payload, req);
    }
  },
};
