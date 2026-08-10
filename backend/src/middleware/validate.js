/**
 * Generic validation middleware. Pass a Zod schema shaped like:
 *   z.object({ params: z.object({...}), query: z.object({...}), body: z.object({...}) })
 * Any of params/query/body can be omitted from the schema if you don't need
 * to validate that part.
 *
 * On success, the parsed (and type-coerced) data is attached to req.validated
 * instead of overwriting req.params/req.query directly — Express 5 makes
 * req.query a getter-only property, so reassigning it breaks. Use
 * req.validated.params / req.validated.query / req.validated.body in your
 * route handlers instead of req.params etc.
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      params: req.params,
      query: req.query,
      body: req.body,
    });

    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid request',
        details: result.error.flatten(),
      });
    }

    req.validated = result.data;
    next();
  };
}

module.exports = { validate };