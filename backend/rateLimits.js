import rateLimit from "express-rate-limit"

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const LoginRateLimiter = rateLimit({
  windowMs: ONE_DAY_IN_MS,
  limit: 10,
  handler : (req, res, next, options) => {
    return res.status(options.statusCode).json({err : "Trop de tentatives, ressayé plus tard."})
  }
})


export const publicGlobalLimits = rateLimit({
    windowMs : ONE_DAY_IN_MS,
    limit : 5,
      handler : (req, res, next, options) => {
    return res.status(options.statusCode).json({err : "Trop de tentatives, ressayé plus tard."})
  }
})

export const adminGlobalLimits = rateLimit({
    windowMs: ONE_DAY_IN_MS,
    limit: 15
})