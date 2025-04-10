export interface IPermission {
  name: string;
  paths: string[]
}

export type PermissionType = Record<string, IPermission>