/**
 * HTTP Status Codes Reference
 * This file contains constants for HTTP status codes with descriptions.
 * Use these constants to maintain consistency and readability in your API responses.
 */

const STATUS_CODES = {
  // 1xx Informational
  CONTINUE: 100, // The server has received the request headers, and the client should proceed to send the request body.
  SWITCHING_PROTOCOLS: 101, // The requester has asked the server to switch protocols.

  // 2xx Success
  OK: 200, // The request has succeeded.
  CREATED: 201, // The request has been fulfilled and resulted in a new resource being created.
  ACCEPTED: 202, // The request has been accepted for processing, but the processing is not complete.
  NO_CONTENT: 204, // The server successfully processed the request, but is not returning any content.

  // 3xx Redirection
  MOVED_PERMANENTLY: 301, // The requested resource has been permanently moved to a new URL.
  FOUND: 302, // The requested resource resides temporarily under a different URL.
  NOT_MODIFIED: 304, // The resource has not been modified since the last request.

  // 4xx Client Errors
  BAD_REQUEST: 400, // The server cannot process the request due to client error (e.g., malformed request syntax).
  UNAUTHORIZED: 401, // Authentication is required and has failed or has not yet been provided.
  FORBIDDEN: 403, // The client does not have access rights to the content.
  NOT_FOUND: 404, // The server cannot find the requested resource.
  METHOD_NOT_ALLOWED: 405, // The request method is not supported for the requested resource.
  CONFLICT: 409, // The request conflicts with the current state of the server (e.g., duplicate entries).
  UNPROCESSABLE_ENTITY: 422, // The request was well-formed but contains semantic errors.

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500, // The server encountered an unexpected condition that prevented it from fulfilling the request.
  NOT_IMPLEMENTED: 501, // The server does not support the functionality required to fulfill the request.
  BAD_GATEWAY: 502, // The server received an invalid response from the upstream server.
  SERVICE_UNAVAILABLE: 503, // The server is currently unavailable (overloaded or down).
  GATEWAY_TIMEOUT: 504, // The server did not receive a timely response from the upstream server.
};

export default STATUS_CODES;
