function statusCode() {
  // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  [].map
    .call(document.querySelectorAll("dt"), a => a.textContent)
    .reduce((a, b) => {
      const c = b.split(/\s+/);
      a[c[0]] = c.slice(1).join(" ");
      return a;
    }, {});
}

const messages = {
  "100": "Continue",
  "101": "Switching Protocols",
  "102": "Processing (WebDAV; RFC 2518)",
  "103": "Checkpoint",
  "200": "OK",
  "201": "Created",
  "202": "Accepted",
  "203": "Non-Authoritative Information (since HTTP/1.1)",
  "204": "No Content",
  "205": "Reset Content",
  "206": "Partial Content (RFC 7233)",
  "207": "Multi-Status (WebDAV; RFC 4918)",
  "208": "Already Reported (WebDAV; RFC 5842)",
  "218": "This is fine (Apache Web Server)",
  "226": "IM Used (RFC 3229)",
  "300": "Multiple Choices",
  "301": "Moved Permanently",
  "302": 'Found (Previously "Moved temporarily")',
  "303": "See Other (since HTTP/1.1)",
  "304": "Not Modified (RFC 7232)",
  "305": "Use Proxy (since HTTP/1.1)",
  "306": "Switch Proxy",
  "307": "Temporary Redirect (since HTTP/1.1)",
  "308": "Permanent Redirect (RFC 7538)",
  "400": "Bad Request",
  "401": "Unauthorized (RFC 7235)",
  "402": "Payment Required",
  "403": "Forbidden",
  "404": "Not Found",
  "405": "Method Not Allowed",
  "406": "Not Acceptable",
  "407": "Proxy Authentication Required (RFC 7235)",
  "408": "Request Timeout",
  "409": "Conflict",
  "410": "Gone",
  "411": "Length Required",
  "412": "Precondition Failed (RFC 7232)",
  "413": "Payload Too Large (RFC 7231)",
  "414": "URI Too Long (RFC 7231)",
  "415": "Unsupported Media Type",
  "416": "Range Not Satisfiable (RFC 7233)",
  "417": "Expectation Failed",
  "418": "I'm a teapot (RFC 2324, RFC 7168)",
  "419": "Page Expired (Laravel Framework)",
  "420": "Enhance Your Calm (Twitter)",
  "421": "Misdirected Request (RFC 7540)",
  "422": "Unprocessable Entity (WebDAV; RFC 4918)",
  "423": "Locked (WebDAV; RFC 4918)",
  "424": "Failed Dependency (WebDAV; RFC 4918)",
  "426": "Upgrade Required",
  "428": "Precondition Required (RFC 6585)",
  "429": "Too Many Requests (RFC 6585)",
  "431": "Request Header Fields Too Large (RFC 6585)",
  "440": "Login Time-out",
  "444": "No Response",
  "449": "Retry With",
  "450": "Blocked by Windows Parental Controls (Microsoft)",
  "451": "Redirect",
  "494": "Request header too large",
  "495": "SSL Certificate Error",
  "496": "SSL Certificate Required",
  "497": "HTTP Request Sent to HTTPS Port",
  "498": "Invalid Token (Esri)",
  "499": "Client Closed Request",
  "500": "Internal Server Error",
  "501": "Not Implemented",
  "502": "Bad Gateway",
  "503": "Service Unavailable",
  "504": "Gateway Timeout",
  "505": "HTTP Version Not Supported",
  "506": "Variant Also Negotiates (RFC 2295)",
  "507": "Insufficient Storage (WebDAV; RFC 4918)",
  "508": "Loop Detected (WebDAV; RFC 5842)",
  "509": "Bandwidth Limit Exceeded (Apache Web Server/cPanel)",
  "510": "Not Extended (RFC 2774)",
  "511": "Network Authentication Required (RFC 6585)",
  "520": "Unknown Error",
  "521": "Web Server Is Down",
  "522": "Connection Timed Out",
  "523": "Origin Is Unreachable",
  "524": "A Timeout Occurred",
  "525": "SSL Handshake Failed",
  "526": "Invalid SSL Certificate",
  "527": "Railgun Error",
  "530": "Origin DNS Error",
  "598": "(Informal convention) Network read timeout error"
};

const standard = {
  messages: {},
  statuses: {},
  codes: [
    100,
    101,
    102,
    103,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    226,
    300,
    301,
    302,
    303,
    304,
    305,
    306,
    307,
    308,
    400,
    401,
    402,
    403,
    404,
    405,
    406,
    407,
    408,
    409,
    410,
    411,
    412,
    413,
    414,
    415,
    416,
    417,
    421,
    422,
    423,
    424,
    425,
    426,
    427,
    428,
    429,
    430,
    431,
    451,
    500,
    501,
    502,
    503,
    504,
    505,
    506,
    507,
    508,
    509,
    510,
    511
  ]
};

const statuses = {};
for (const code in messages) {
  const codeInt = +code;
  const status = messages[code]
    .replace(/\s*\([^)]+\)\s*/g, " ")
    .trim()
    .replace(/[\s+\-']/g, "");
  statuses[status] = codeInt;
  if (standard.codes.includes(codeInt)) {
    standard.messages[code] = messages[code];
    standard.statuses[status] = codeInt;
  }
}

module.exports = {
  messages,
  statuses,
  codes: Object.keys(messages).map(code => +code),
  standard
};
