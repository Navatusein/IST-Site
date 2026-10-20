import {IBasePageComponent} from "@/entities/dynamic-page";

export interface ICardsPageComponent extends IBasePageComponent {
  componentType: "cards";
  cardsInRow: 2|3,
  cards: {content: string}[]
}
