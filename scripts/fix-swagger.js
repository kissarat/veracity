const {
  getOptions,
  pretty,
  visitor,
  resolveFilename
} = require("../utilities");
const _ = require("lodash");

const defaultResponse = "#/definitions/okResponse";

function deleteProperty(o, sub, parent) {
  delete parent[_.last(sub)];
}

const visits = [
  visitor(
    o => (o["200"] = { $ref: defaultResponse }),
    o => _.isObject(o) && _.isObject(o["200"]) && _.isEmpty(o["200"])
  ),
  visitor(
    deleteProperty,
    o =>
      _.isObject(o) && _.isObject(o["200"]) && defaultResponse === o["200"].$ref
  ),
  visitor(
    o =>
      (o.parameters = o.parameters.filter(
        p =>
          !(
            ("header" === p.in &&
              "Content-Type" === p.name &&
              "" === p.description) ||
            "#/definitions/idParameter" === p.$ref
          )
      )),
    o => _.isObject(o) && o.parameters instanceof Array
  ),
  visitor(deleteProperty, o => (_.isObject(o) || _.isArray(o)) && _.isEmpty(o)),
  visitor(
    deleteProperty,
    (o, sub) =>
      _.isArray(o) &&
      1 === o.length &&
      "produces" === _.last(sub) &&
      "application/json" === o[0]
  ),
  visitor(
    deleteProperty,
    (o, sub) =>
      "string" === typeof o && 0 === o.length && "description" === _.last(sub)
  ),
  visitor(deleteProperty, (o, sub) => "__v" === _.last(sub))
];

function main(options, jsonFilename = resolveFilename("client", "swagger")) {
  const json = require(jsonFilename);
  for (const visit of visits) {
    visit(json);
  }
  console.log(pretty(json));
}

main(...getOptions());
