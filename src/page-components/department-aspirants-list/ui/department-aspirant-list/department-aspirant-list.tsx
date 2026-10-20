import {ConfigProvider, Flex, Row, theme, Typography} from "antd";
import {DepartmentPersonCard} from "@/shared/ui-kit";
import {IPageComponentViewProps, usePageComponentData} from "@/entities/dynamic-page/model";
import {IDepartmentAspirantListData, IDepartmentAspirantListPageComponent} from "../../types/type";

export default function DepartmentAspirantList(props: IPageComponentViewProps<IDepartmentAspirantListPageComponent, IDepartmentAspirantListData>) {
  const {token: {paddingLG}} = theme.useToken();

  const data = usePageComponentData(props.component, props.data);

  const aspirants = data?.aspirants ?? [];
  const graduates = data?.graduates ?? [];

  return (
    <Row gutter={[paddingLG, paddingLG]} justify="center">
      <ConfigProvider theme={{token: {screenMDMin: 900, screenXLMin: 1300}}}>
        <Flex vertical gap="middle" align="center" style={{height: "100%"}}>
          {aspirants.map((aspirant) => (
            <DepartmentPersonCard imageSlug={aspirant.imageSlug} key={String(aspirant._id)}>
              <Flex vertical>
                <Typography.Paragraph style={{margin: 0}}>
                  Аспірант кафедри
                </Typography.Paragraph>
                <Flex vertical gap="small">
                  <Typography.Title level={4} style={{margin: 0}}>
                    {`${aspirant.lastName} ${aspirant.firstName} ${aspirant.middleName}`}
                  </Typography.Title>
                  <Typography.Paragraph style={{margin: 0}}>
                    <Typography.Text strong>
                      Керівник:&nbsp;
                    </Typography.Text>
                    {data?.staffNames[String(aspirant.thesisHeadId)] ?? ""}
                  </Typography.Paragraph>
                  <Typography.Paragraph style={{margin: 0}}>
                    <Typography.Text strong>
                      Тема:&nbsp;
                    </Typography.Text>
                    {aspirant.thesisTheme}
                  </Typography.Paragraph>
                </Flex>
              </Flex>
            </DepartmentPersonCard>
          ))}
          {graduates.length != 0 && (
            <Typography.Title level={3} style={{margin: "0 16px", width: "100%"}}>
              Випускники
            </Typography.Title>
          )}
          {graduates.map((graduate) => (
            <DepartmentPersonCard imageSlug={graduate.imageSlug} key={String(graduate._id)}>
              <Flex vertical gap="small">
                <Typography.Title level={4} style={{margin: 0}}>
                  {`${graduate.lastName} ${graduate.firstName} ${graduate.middleName}`}
                </Typography.Title>
                <Typography.Paragraph style={{margin: 0}}>
                  <Typography.Text strong>
                    Дата захисту:&nbsp;
                  </Typography.Text>
                  {new Date(graduate.thesisDate!).toLocaleDateString("uk-UA", {timeZone: "Europe/Kyiv"})}
                </Typography.Paragraph>
                <Typography.Paragraph style={{margin: 0}}>
                  <Typography.Text strong>
                    Тема:&nbsp;
                  </Typography.Text>
                  {graduate.thesisTheme}
                </Typography.Paragraph>
              </Flex>
            </DepartmentPersonCard>
          ))}
        </Flex>
      </ConfigProvider>
    </Row>
  )
}
