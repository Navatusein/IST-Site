import {IBasePageComponent} from "@/entities/dynamic-page";

export interface ITitlePageComponent extends IBasePageComponent {
  componentType: "title";
  level: 1|2|3|4|5;
  title: string;
}
