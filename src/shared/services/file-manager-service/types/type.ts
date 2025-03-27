export type IFileTypes = "directory"|"file"|"image"|"pdf"|"text"|"back"|"archive"|"video";

export interface IFile {
  name: string;
  path: string;
  type: IFileTypes;
  size: number;
}

export interface IDirectory extends IFile {
  pathTo: string;
}