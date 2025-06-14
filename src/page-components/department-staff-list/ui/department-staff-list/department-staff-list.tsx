import {useEffect, useMemo, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import DepartmentStaffListEditor from "../department-staff-list-editor/department-staff-list-editor";
import {IDepartmentStaffListPageComponent} from "../../types/type";
import {Button, Card, Col, Flex, Image, Row, theme, Typography} from "antd";
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

  const colConfigs = useMemo(() => {
    if (typedComponentProps?.width == "large"){
      return {
        container: {
          xs: {span: 24, offset: 0},
          xl: {span: 18, offset: 3},
          xxl: {span: 16, offset: 4}
        },
        card: {
          xs: {span: 24, offset: 0},
          sm: {span: 12, offset: 0},
          lg: {span: 8, offset: 0},
          xl: {span: 8, offset: 0},
          xxl: {span: 6, offset: 0},
        }
      };
    }
    else {
      return {
        container: {
          xs: {span: 24, offset: 0},
        },
        card: {
          xs: {span: 24, offset: 0},
          sm: {span: 12, offset: 0},
          xl: {span: 8, offset: 0},
        }
      }
    }
  }, [typedComponentProps?.width]);

  const [teachers, setTeachers] = useState<IDepartmentStaff[]>([]);

  useEffect(() => {
    if (typedComponentProps != null) {
      useServerAction(getDepartmentStaffAction())
        .then((data) => {
          setTeachers(() => data);
        });
    }
  }, []);

  const {token: {padding, paddingXL}} = theme.useToken();

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Col
        style={typedComponentProps?.width == "large" ? {padding: `0 ${paddingXL}px`}: {}}
        {...colConfigs.container}
      >
        <Row gutter={[padding, paddingXL]} justify="center">
          {teachers.map((teacher) => (
            <Col key={teacher.path} {...colConfigs.card}>
              <Card
                hoverable
                style={{height: "100%", display: "flex", flexDirection: "column"}}
                styles={{
                  body: {height: "100%"}
                }}
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
                  <Flex vertical gap="small">
                    <Typography.Title level={4} style={{margin: 0}}>
                      {`${teacher.firstName} ${teacher.lastName}`}
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
        </Row>
      </Col>
    </PageComponentError>
  )
}

DepartmentStaffList.Editor = DepartmentStaffListEditor