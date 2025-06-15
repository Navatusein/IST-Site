"use client"

import dynamic from "next/dynamic";
import {ComponentCol, Loader} from "@/shared/ui-kit";
import {IDepartmentStaff} from "@/entities/department-staff";
import {Card, Col, Flex, Image, Row, theme, Typography} from "antd";
import {GlobalOutlined, MailOutlined} from "@ant-design/icons";

interface IProps {
  teacher: IDepartmentStaff;
}

const DepartmentStaffRenderer = dynamic(() => import("@/views/department-staff/ui/department-staff-renderer/department-staff-renderer"), {
  ssr: false,
  loading: () => <Loader/>
});

export default function DepartmentStaffView(props: IProps) {
  const {token: {paddingLG, padding, paddingXS, borderRadius}} = theme.useToken();

  return (
    <ComponentCol width="medium">
      <Row gutter={[padding, padding]} style={{position: "relative", marginTop: paddingLG}}>
        <Col
          xxl={{span: 7}}
          md={{span: 8}}
          sm={{span: 10}}
          xs={{span: 24}}
        >
          <Flex vertical gap="middle" style={{position: "sticky", top: paddingLG + 64, marginBottom: paddingLG}}>
            <Image
              src={`/api/assets${props.teacher.imagePath}`}
              fallback="/missing-image.webp"
              preview={false}
              style={{
                objectFit: "cover",
                borderRadius: borderRadius,
                aspectRatio: "1",
                filter: "grayscale(100%)"
              }}
            />
            <Card variant="borderless">
              <Flex vertical>
                <Typography.Title level={4} style={{margin: 0}}>
                  {`${props.teacher.lastName} ${props.teacher.firstName} ${props.teacher.middleName}`}
                </Typography.Title>
                <Typography.Text strong style={{margin: 0}}>
                  {props.teacher.position}
                </Typography.Text>
              </Flex>
            </Card>
            <Card variant="borderless">
              <Typography.Title level={4} style={{margin: 0}}>
                Контакти
              </Typography.Title>
              <Flex vertical style={{marginLeft: "2px"}}>
                <Typography.Link
                  href={`mailto:${props.teacher.email}`}
                  style={{margin: 0, wordBreak: "break-all"}}
                >
                  <MailOutlined style={{marginRight: paddingXS}}/>
                  {props.teacher.email}
                </Typography.Link>
                {props.teacher.profiles.map((profile) => (
                  <Typography.Link
                    key={`profile-${profile.title}`}
                    href={profile.url}
                    style={{margin: 0, wordBreak: "break-all"}}
                  >
                    <GlobalOutlined style={{marginRight: paddingXS}}/>
                    {profile.title}
                  </Typography.Link>
                ))}
              </Flex>
            </Card>
          </Flex>
        </Col>
        <Col
          xxl={{span: 17}}
          md={{span: 16}}
          sm={{span: 14}}
          xs={{span: 24}}
        >
          <DepartmentStaffRenderer teacher={props.teacher}/>
        </Col>
      </Row>
    </ComponentCol>
  )
}
