import Cards from "./ui/cards/cards";
import {ICardsPageComponent} from "./types/type";
import {definePageComponent} from "@/entities/dynamic-page/model";
import dynamic from "next/dynamic";
import {Skeleton} from "antd";

const CardsEditor = dynamic(() => import("./ui/cards-editor/cards-editor"), {loading: () => <Skeleton active/>});

export type {ICardsPageComponent};

export const cardsPageComponent = definePageComponent<ICardsPageComponent>({
  type: "cards",
  name: "Картки",
  category: "universal",
  defaults: {
    width: "medium",
    cardsInRow: 2,
    cards: [
      {
        content: "{\"type\":\"doc\",\"content\":[{\"type\":\"heading\",\"attrs\":{\"level\":4},\"content\":[{\"type\":\"text\",\"text\":\"ОСВІТНЯ КВАЛІФІКАЦІЯ\"}]},{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Бакалавр інформаційних систем та технологій\"}]}]}"
      },
      {
        content: "{\"type\":\"doc\",\"content\":[{\"type\":\"heading\",\"attrs\":{\"level\":4},\"content\":[{\"type\":\"text\",\"text\":\"КОМПЕТЕНТНОСТІ\"}]},{\"type\":\"bulletList\",\"content\":[{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Здатність проєктувати готові IoT-рішення;\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Використовувати варіанти технічних пристроїв в готових модулях, так і використовуючи розробку та програмування інженерних пристроїв;\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Управління збором інформації з інженерних систем, управління ними;\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Налаштування автоматизованої взаємодії елементів IoT-систем.\"}]}]}]}]}"
      },
      {
        content: "{\"type\":\"doc\",\"content\":[{\"type\":\"heading\",\"attrs\":{\"level\":4},\"content\":[{\"type\":\"text\",\"text\":\"СФЕРА ДІЯЛЬНОСТІ\"}]},{\"type\":\"bulletList\",\"content\":[{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Розробник IoT пристроїв;\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Тестувальник IoT;\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Інженер-програміст;\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Інженер-розробник;\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Фахівець з інформаційних технологій;\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Фахівець із розробки та тестування програмного забезпечення;\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Web/Frontend-розробник проєктів IoT;\"}]}]},{\"type\":\"listItem\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"Програміст мікроконтролерів.\"}]}]}]}]}"
      }
    ]
  },
  View: Cards,
  Editor: CardsEditor
});
