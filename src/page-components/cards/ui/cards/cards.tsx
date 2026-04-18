import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import CardsEditor from "../cards-editor/cards-editor";
import {ICardsPageComponent} from "../../types/type";
import {Card, Col, Row, theme} from "antd";
import {RichTextRenderer} from "@/features/rich-text-renderer";

interface IProps {
  component: IBasePageComponent;
}

export default function Cards(props: IProps) {
  const {token: {padding}} = theme.useToken();

  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "cards")
      return null;

    return props.component as ICardsPageComponent;
  }, [props]);

  const colConfigs = useMemo(() => {
    if (typedComponent?.width == "small"){
      return {
        ["count-2"]: {
          lg: 12,
          xs: 24
        },
        ["count-2-first"]: {
          xs: 24
        },
        ["count-3"]: {
          xl: 8,
          xs: 24
        },
        ["count-3-first"]: {
          xs: 24
        }
      };
    }
    else {
      return {
        ["count-2"]: {
          md: 12,
          xs: 24
        },
        ["count-2-first"]: {
          xs: 24
        },
        ["count-3"]: {
          lg: 8,
          xs: 24
        },
        ["count-3-first"]: {
          xs: 24
        }
      };
    }
  }, [typedComponent?.width]);

  const getIndex = (index: number): "count-2" | "count-2-first" | "count-3" | "count-3-first" => {
    return (index == 0 && typedComponent!.cards.length % typedComponent!.cardsInRow == 1) ?
      `count-${typedComponent!.cardsInRow as 2 | 3}-first`: `count-${typedComponent!.cardsInRow as 2 | 3}`;
  }

  return (
    <PageComponentError component={typedComponent}>
      <Row gutter={[padding, padding]}>
        {typedComponent!.cards.map((card, index) => (
          <Col
            key={`card-${index}`}
            {...colConfigs[getIndex(index)]}
          >
            <Card style={{height: "100%"}} styles={{body: {height: "100%"}}}>
              <RichTextRenderer content={card.content}/>
            </Card>
          </Col>
        ))}
      </Row>
    </PageComponentError>
  )
}

Cards.Editor = CardsEditor