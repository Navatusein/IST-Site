import {Form, Select} from "antd";
import {ICardsPageComponent} from "@/page-components/cards";

export default function FormComponentCommon() {
  return (
    <>
      <Form.Item<ICardsPageComponent>
        label="Кількість карток в ряд"
        name="cardsInRow"
        style={{marginBottom: 0}}
        extra="Кількість карток яка буде відображатись ряду"
      >
        <Select
          options={[
            {value: 2, label: "2 картки"},
            {value: 3, label: "3 картки"}
          ]}
        />
      </Form.Item>
    </>
  )
}
