import { Request, Response, NextFunction } from "express";
import { CacheService } from "../services/cache.service";

export const cacheMiddleware = (cache: CacheService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const filename = req.params.filename;

    try {
      const cachedVideo = await cache.get(filename);
      if (cachedVideo) {
        const range = req.headers.range;
        const videoService = new VideoService(new StorageService(), cache);
        const { stream, headers, statusCode } = await videoService.streamVideo(
          filename,
          range
        );

        res.writeHead(statusCode, headers);
        return stream.pipe(res);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
