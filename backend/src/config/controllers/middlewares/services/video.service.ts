import { StorageService } from "./storage.service";
import { CacheService } from "./cache.service";
import { Readable } from "stream";

export class VideoService {
  constructor(private storage: StorageService, private cache: CacheService) {}

  async uploadVideo(filename: string, buffer: Buffer): Promise<void> {
    // Primeiro salva no cache para disponibilização imediata
    await this.cache.set(filename, buffer);
    // Depois persiste no storage (em background)
    this.storage.saveFile(filename, buffer).catch(console.error);
  }

  async streamVideo(
    filename: string,
    range?: string
  ): Promise<{
    stream: Readable;
    headers: {
      "Content-Type": string;
      "Content-Length"?: number;
      "Content-Range"?: string;
      "Accept-Ranges": "bytes";
    };
    statusCode: number;
  }> {
    // Tenta obter do cache primeiro
    const cachedVideo = await this.cache.get(filename);

    if (cachedVideo) {
      return this.handleRange(range, cachedVideo, filename);
    }

    // Se não estiver no cache, busca do storage
    const fileStream = await this.storage.getFileStream(filename);

    if (!fileStream) {
      throw new Error("File not found");
    }

    const fileSize = await this.storage.getFileSize(filename);
    return this.handleRange(range, fileStream, filename, fileSize);
  }

  private handleRange(
    range: string | undefined,
    content: Buffer | Readable,
    filename: string,
    fileSize?: number
  ) {
    const mimeType = this.getMimeType(filename);
    const isBuffer = Buffer.isBuffer(content);

    if (!range) {
      return {
        stream: isBuffer ? Readable.from(content) : content,
        headers: {
          "Content-Type": mimeType,
          "Content-Length": isBuffer ? content.length : fileSize,
          "Accept-Ranges": "bytes",
        },
        statusCode: 200,
      };
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : (isBuffer ? content.length : fileSize!) - 1;
    const chunkSize = end - start + 1;

    let stream: Readable;
    if (isBuffer) {
      stream = Readable.from(content.subarray(start, end + 1));
    } else {
      stream = (content as fs.ReadStream).pipe(
        new Transform({
          transform(chunk, _, callback) {
            this.push(chunk);
            callback();
          },
        })
      );
    }

    return {
      stream,
      headers: {
        "Content-Type": mimeType,
        "Content-Range": `bytes ${start}-${end}/${
          isBuffer ? content.length : fileSize
        }`,
        "Content-Length": chunkSize,
        "Accept-Ranges": "bytes",
      },
      statusCode: 206,
    };
  }

  private getMimeType(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      mp4: "video/mp4",
      webm: "video/webm",
      ogv: "video/ogg",
      mov: "video/quicktime",
    };
    return mimeTypes[ext || ""] || "application/octet-stream";
  }
}
