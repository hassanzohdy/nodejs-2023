import { ensureDirectory } from "@mongez/fs";
import { Random } from "@mongez/reinforcements";
import { writeFileSync } from "fs";
import path from "path";

export default class UploadedFile {
  /**
   * File buffered content
   */
  private bufferedFileContent: any;

  /**
   * Constructor
   */
  public constructor(private readonly fileData: any) {
    //
  }

  /**
   * Get file name
   */
  public get name() {
    return this.fileData.filename;
  }

  /**
   * Get file mime type
   */
  public get mimeType() {
    return this.fileData.mimetype;
  }

  /**
   * Get file extension
   */
  public get extension() {
    return path
      .extname(this.fileData.filename)
      .replace(".", "")
      .toLocaleLowerCase();
  }

  /**
   * Get file size in bytes
   */
  public async size() {
    const file = await this.buffer();

    return file.toString().length;
  }

  /**
   * Get file buffer
   */
  public async buffer() {
    if (this.bufferedFileContent) {
      return this.bufferedFileContent;
    }

    this.bufferedFileContent = await this.fileData.toBuffer();

    return this.bufferedFileContent;
  }

  /**
   * Save file to the given path
   */
  public async saveTo(path: string) {
    ensureDirectory(path);

    const fileContent = await this.buffer();

    writeFileSync(path + "/" + this.name, fileContent);
  }

  /**
   * Save the file to the given path with the given name
   */
  public async saveAs(path: string, name: string) {
    ensureDirectory(path);

    const fileContent = await this.buffer();

    writeFileSync(path + "/" + name, fileContent);
  }

  /**
   * Save the file to the given path with random generated name
   */
  public async save(path: string) {
    ensureDirectory(path);
    const name = Random.string(64) + "." + this.extension;

    const fileContent = await this.buffer();

    writeFileSync(path + "/" + name, fileContent);

    return name;
  }
}
