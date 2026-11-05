export interface IRecordOrderItem {
  id: string;
  title: string;
  description?: string;
}

export interface IRecordOrderGroup {
  key: string;
  title?: string;
  items: IRecordOrderItem[];
}
