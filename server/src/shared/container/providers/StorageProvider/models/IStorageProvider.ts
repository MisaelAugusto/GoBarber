export default interface IStorageProvider {
  saveFile(file: string): Promise<string | null>;
  deleteFile(file: string): Promise<void>;
}
