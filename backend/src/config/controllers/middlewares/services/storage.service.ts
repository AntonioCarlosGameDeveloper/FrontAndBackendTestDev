import fs from "fs";
import path from "path";
import { storageConfig } from "../config/storage";

export class StorageService {
  private readonly storageDir: string;

  constructor() {
    this.storageDir = storageConfig.local?.directory || "./videos";
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async saveFile(filename: string, buffer: Buffer): Promise<void> {
    const filePath = path.join(this.storageDir, filename);
    await fs.promises.writeFile(filePath, buffer);
  }

  async getFileStream(filename: string): Promise<fs.ReadStream | null> {
    const filePath = path.join(this.storageDir, filename);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    return fs.createReadStream(filePath);
  }

  async getFileSize(filename: string): Promise<number> {
    const filePath = path.join(this.storageDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    const stats = await fs.promises.stat(filePath);
    return stats.size;
  }
}
