module.exports = {
  found(ctx, n = 1) {
    if (0 === n) {
      ctx.status = 404;
    }
    return {
      ok: n > 0,
      code: n > 0 ? 'Success' : 'NotFound'
    };
  },
  report(ctx, err, extra = null) {
    ctx.status = err.statusCode || 502;
    strapi.log.error(err);
    const response = {
      ok: false,
      code: err.code || '',
      message: err.message || ''
    };
    if (extra) {
      Object.assign(response, extra);
    }
    if ('string' === typeof err.stack && 'production' !== strapi.config.environment) {
      response.$stack = err.stack.split(/\s*\n\s*(at\s*)?/g);
    }
    return response;
  }
};
