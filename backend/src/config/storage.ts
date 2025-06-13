export interface StorageConfig {
  type: "local" | "s3" | "google-cloud";
  local?: {
    directory: string;
  };
}

export const storageConfig: StorageConfig = {
  type:
    process.env.STORAGE_TYPE === "s3"
      ? "s3"
      : process.env.STORAGE_TYPE === "google-cloud"
      ? "google-cloud"
      : "local",
  local: {
    directory: process.env.STORAGE_DIR || "./videos",
  },
};
