import {Form, Select} from "antd";
import {ICardsPageComponent} from "../../types/type";

export default function FormComponentCommon() {
  return (
    <>
      <Form.Item<ICardsPageComponent>
        label="Кількість карток в ряд"
        name="cardsInRow"
        style={{marginBottom: 0}}
        extra="На вузьких екранах картки йдуть одна під одною"
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
