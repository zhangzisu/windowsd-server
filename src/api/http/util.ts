import { Request, Response, NextFunction } from 'express'

export const $ = (handle: (req: Request, res: Response, next?: NextFunction) => any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handle(req, res, next)
    } catch (e) {
      res.status(500).send(e.message)
    }
  }
}
