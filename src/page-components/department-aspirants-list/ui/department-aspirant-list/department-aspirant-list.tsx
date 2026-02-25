import {useEffect, useMemo, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {DepartmentPersonCard, PageComponentError} from "@/shared/ui-kit";
import DepartmentAspirantListEditor from "@/page-components/department-aspirants-list/ui/department-aspirant-list-editor/department-aspirant-list-editor";
import {IDepartmentAspirantListPageComponent} from "../../types/type";
import {ConfigProvider, Flex, Row, theme, Typography} from "antd";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {IDepartmentAspirant} from "@/entities/department-aspirant/types/type";
import {getDepartmentAspirantAction} from "@/entities/department-aspirant/actions/actions";
import {getDepartmentStaffAction} from "@/entities/department-staff/actions/actions";

interface IProps {
  componentProps: IBasePageComponent;
}

export default function DepartmentAspirantList(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "department-aspirant-list")
      return null;

    return props.componentProps as IDepartmentAspirantListPageComponent;
  }, [props]);

  const [departmentAspirants, setDepartmentAspirants] = useState<IDepartmentAspirant[]>([]);
  const [departmentGraduates, setDepartmentGraduates] = useState<IDepartmentAspirant[]>([]);
  const [departmentStaffs, setDepartmentStaffs] = useState<Record<string, string>>()

  useEffect(() => {
    if (typedComponentProps != null) {
      useServerAction(getDepartmentAspirantAction())
        .then((data) => {
          setDepartmentAspirants(() => data.filter(x => (x.thesisDate == null)));
          setDepartmentGraduates(() => data.filter(x => (x.thesisDate != null)));
        });

      useServerAction(getDepartmentStaffAction())
        .then((data) => {
          setDepartmentStaffs(() => data.reduce<Record<string, string>>(
            (array, value) => {
              array[String(value._id)] = `${value.lastName} ${value.firstName} ${value.middleName}`;
              return array;
            }, {}));
        });
    }
  }, []);

  const {token: {paddingLG}} = theme.useToken();

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Row gutter={[paddingLG, paddingLG]} justify="center">
        <ConfigProvider theme={{token: {screenMDMin: 900, screenXLMin: 1300}}}>
          <Flex vertical gap="middle" align="center" style={{height: "100%"}}>
            {departmentAspirants.map((aspirant) => (
            <DepartmentPersonCard imagePath={aspirant.imagePath} key={String(aspirant._id)}>
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
                    {departmentStaffs?.[String(aspirant.thesisHeadId)] ?? ""}
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
          {departmentGraduates.length != 0 && (
            <Typography.Title level={3} style={{margin: "0 16px", width: "100%"}}>
              Випускники
            </Typography.Title>
          )}
          {departmentGraduates.map((graduates) => (
            <DepartmentPersonCard imagePath={graduates.imagePath} key={String(graduates._id)}>
              <Flex vertical gap="small">
                <Typography.Title level={4} style={{margin: 0}}>
                  {`${graduates.lastName} ${graduates.firstName} ${graduates.middleName}`}
                </Typography.Title>
                <Typography.Paragraph style={{margin: 0}}>
                  <Typography.Text strong>
                    Дата захисту:&nbsp;
                  </Typography.Text>
                  {new Date(graduates.thesisDate!).toLocaleDateString()}
                </Typography.Paragraph>
                <Typography.Paragraph style={{margin: 0}}>
                  <Typography.Text strong>
                    Тема:&nbsp;
                  </Typography.Text>
                  {graduates.thesisTheme}
                </Typography.Paragraph>
              </Flex>
            </DepartmentPersonCard>
          ))}
          </Flex>
        </ConfigProvider>
      </Row>
    </PageComponentError>
  )
}

DepartmentAspirantList.Editor = DepartmentAspirantListEditor