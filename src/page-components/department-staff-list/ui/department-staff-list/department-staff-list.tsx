import {Button, ConfigProvider, Flex, Row, theme, Typography} from "antd";
import Link from "next/link";
import {DepartmentPersonCard} from "@/shared/ui-kit";
import {IPageComponentViewProps, usePageComponentData} from "@/entities/dynamic-page/model";
import {DepartmentStaffListData, IDepartmentStaffListPageComponent} from "../../types/type";

export default function DepartmentStaffList(props: IPageComponentViewProps<IDepartmentStaffListPageComponent, DepartmentStaffListData>) {
  const {token: {paddingLG}} = theme.useToken();

  const departmentStaffs = usePageComponentData(props.component, props.data) ?? [];

  return (
    <Row gutter={[paddingLG, paddingLG]} justify="center">
      <ConfigProvider theme={{token: {screenMDMin: 900, screenXLMin: 1300}}}>
        {departmentStaffs.map((departmentStaff) => (
          <DepartmentPersonCard imageSlug={departmentStaff.imageSlug} key={String(departmentStaff._id)}>
            <Flex vertical>
              <Typography.Title level={4} style={{margin: 0}}>
                {`${departmentStaff.lastName} ${departmentStaff.firstName} ${departmentStaff.middleName}`}
              </Typography.Title>
              <Typography.Paragraph strong style={{margin: 0}}>
                {departmentStaff.position}
              </Typography.Paragraph>
            </Flex>
            <Link href={`/department-staff/${departmentStaff.path}`}>
              <Button block type="primary">
                Перейти до профілю
              </Button>
            </Link>
          </DepartmentPersonCard>
        ))}
      </ConfigProvider>
    </Row>
  )
}
