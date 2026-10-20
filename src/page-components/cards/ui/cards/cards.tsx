import {useMemo} from "react";
import {Card, Col, Row, theme} from "antd";
import {RichTextRenderer} from "@/features/rich-text-renderer";
import {IPageComponentViewProps} from "@/entities/dynamic-page/model";
import {ICardsPageComponent} from "../../types/type";

export default function Cards(props: IPageComponentViewProps<ICardsPageComponent>) {
  const {token: {padding}} = theme.useToken();

  const colConfigs = useMemo(() => {
    if (props.component.width == "small"){
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
  }, [props.component.width]);

  const getIndex = (index: number): "count-2" | "count-2-first" | "count-3" | "count-3-first" => {
    return (index == 0 && props.component.cards.length % props.component.cardsInRow == 1) ?
      `count-${props.component.cardsInRow}-first`: `count-${props.component.cardsInRow}`;
  }

  return (
    <Row gutter={[padding, padding]}>
      {props.component.cards.map((card, index) => (
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
  )
}
