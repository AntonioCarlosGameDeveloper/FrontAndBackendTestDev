import express from "express";
import { VideoController } from "./controllers/video.controller";
import { uploadMiddleware } from "./middlewares/upload.middleware";
import { CacheService } from "./services/cache.service";
import { cacheMiddleware } from "./middlewares/cache.middleware";

const cache = new CacheService();

export const app = express();

app.post("/upload/video", uploadMiddleware, VideoController.uploadVideo);

app.get(
  "/static/video/:filename",
  cacheMiddleware(cache),
  VideoController.streamVideo
);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
);
