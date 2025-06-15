import {useEffect, useMemo, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import DepartmentStaffListEditor from "../department-staff-list-editor/department-staff-list-editor";
import {IDepartmentStaffListPageComponent} from "../../types/type";
import {Button, Card, Col, ConfigProvider, Flex, Image, Row, theme, Typography} from "antd";
import Link from "next/link";
import {IDepartmentStaff} from "@/entities/department-staff";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {getDepartmentStaffAction} from "@/entities/department-staff/actions/actions";

interface IProps {
  componentProps: IBasePageComponent;
}

export default function DepartmentStaffList(props: IProps) {
  const typedComponentProps = useMemo(() => {
    if (props.componentProps.type !== "department-staff-list")
      return null;

    return props.componentProps as IDepartmentStaffListPageComponent;
  }, [props]);

  const [teachers, setTeachers] = useState<IDepartmentStaff[]>([]);

  useEffect(() => {
    if (typedComponentProps != null) {
      useServerAction(getDepartmentStaffAction())
        .then((data) => {
          setTeachers(() => data);
        });
    }
  }, []);

  const {token: {paddingLG}} = theme.useToken();

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Row gutter={[paddingLG, paddingLG]} justify="center">
        <ConfigProvider theme={{token: {screenMDMin: 900, screenXLMin: 1300}}}>
          {teachers.map((teacher) => (
            <Col
              key={teacher.path}
              xs={{span: 24}}
              sm={{span: 12}}
              md={{span: 8}}
              xl={{span: 6}}
            >
              <Card
                hoverable
                variant="borderless"
                style={{height: "100%", display: "flex", flexDirection: "column"}}
                styles={{body: {height: "100%"}}}
                cover={
                  <Image
                    src={`/api/assets${teacher.imagePath}`}
                    fallback="/missing-image.webp"
                    preview={false}
                    height={350}
                    style={{objectFit: "cover", borderRadius: " 8px 8px 0 0", aspectRatio: "3 \ 4", filter: "grayscale(100%)"}}
                  />
                }
              >
                <Flex vertical style={{height: "100%"}} gap="middle" justify="space-between">
                  <Flex vertical>
                    <Typography.Title level={4} style={{margin: 0}}>
                      {`${teacher.lastName} ${teacher.firstName} ${teacher.middleName}`}
                    </Typography.Title>
                    <Typography.Paragraph strong style={{margin: 0}}>
                      {teacher.position}
                    </Typography.Paragraph>
                  </Flex>
                  <Link href={`/department-staff/${teacher.path}`}>
                    <Button block type="primary">
                      Перейти до профілю
                    </Button>
                  </Link>
                </Flex>
              </Card>
            </Col>
          ))}
        </ConfigProvider>
      </Row>
    </PageComponentError>
  )
}

DepartmentStaffList.Editor = DepartmentStaffListEditor