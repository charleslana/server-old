import sanitizeHtml from 'sanitize-html';
import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';

export function sanitizeHtmlMiddleware<T extends RouteGenericInterface>() {
  return (
    request: FastifyRequest<T>,
    _reply: FastifyReply,
    doneHook: () => void
  ) => {
    if (request.body) {
      const body = request.body as Record<string, string>;
      for (const key in body) {
        const value = body[key];
        if (typeof value === 'string') {
          body[key] = escapeTagsHTML(value);
        }
      }
    }
    doneHook();
  };
}

const escapeTagsHTML = (input: string): string => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
};
