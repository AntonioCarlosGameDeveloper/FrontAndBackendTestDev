import { Request, Response } from "express";
import { VideoService } from "../services/video.service";
import { StorageService } from "../services/storage.service";
import { CacheService } from "../services/cache.service";

const storage = new StorageService();
const cache = new CacheService();
const videoService = new VideoService(storage, cache);

export class VideoController {
  static async uploadVideo(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filename = `${Date.now()}-${req.file.originalname}`;
      await videoService.uploadVideo(filename, req.file.buffer);

      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async streamVideo(req: Request, res: Response) {
    try {
      const filename = req.params.filename;
      const range = req.headers.range;

      const { stream, headers, statusCode } = await videoService.streamVideo(
        filename,
        range
      );

      res.writeHead(statusCode, headers);
      return stream.pipe(res);
    } catch (err: any) {
      if (err.message === "File not found") {
        return res.status(404).json({ error: "File not found" });
      }
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
