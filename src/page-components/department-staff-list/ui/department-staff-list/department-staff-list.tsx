import {useEffect, useMemo, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {DepartmentPersonCard, PageComponentError} from "@/shared/ui-kit";
import DepartmentStaffListEditor from "../department-staff-list-editor/department-staff-list-editor";
import {IDepartmentStaffListPageComponent} from "../../types/type";
import {Button, ConfigProvider, Flex, Row, theme, Typography} from "antd";
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

  const [departmentStaffs, setDepartmentStaffs] = useState<IDepartmentStaff[]>([]);

  useEffect(() => {
    if (typedComponentProps != null) {
      useServerAction(getDepartmentStaffAction())
        .then((data) => {
          setDepartmentStaffs(() => data);
        });
    }
  }, []);

  const {token: {paddingLG}} = theme.useToken();

  return (
    <PageComponentError message={typedComponentProps == null ? "Fail" : ""}>
      <Row gutter={[paddingLG, paddingLG]} justify="center">
        <ConfigProvider theme={{token: {screenMDMin: 900, screenXLMin: 1300}}}>
          {departmentStaffs.map((departmentStaff) => (
            <DepartmentPersonCard imagePath={departmentStaff.imagePath} key={String(departmentStaff._id)}>
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
    </PageComponentError>
  )
}

DepartmentStaffList.Editor = DepartmentStaffListEditor