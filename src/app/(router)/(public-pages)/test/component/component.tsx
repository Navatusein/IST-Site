"use client"

// import styles from "./component.module.scss";
import {Button, Card, Col, Flex, Image, Row, theme, Typography} from "antd";
import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {IDepartmentStaff} from "@/entities/department-staff";
import {getDepartmentStaffAction} from "@/entities/department-staff/actions/actions";

interface IProps {
  width: "medium" | "large";
}

export default function Component(props: IProps) {
  const typedComponentProps = {
    type: "contact-us",
    width: props.width,
  }

  const colConfigs = useMemo(() => {
    if (typedComponentProps.width == "large"){
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
  }, [typedComponentProps.width]);

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
    <>
      <Row>
        <Col>
          <Link href="#">
            <Button>ОПИС ОСВІТНЬО-ПРОФЕСІЙНОЇ ПРОГРАМИ</Button>
          </Link>
        </Col>
        <Col>
          <Link href="#">
            <Button>ОПИС ОСВІТНЬО-ПРОФЕСІЙНОЇ ПРОГРАМИ</Button>
          </Link>
        </Col>
        <Col>
          <Link href="#">
            <Button>ОПИС ОСВІТНЬО-ПРОФЕСІЙНОЇ ПРОГРАМИ</Button>
          </Link>
        </Col>
      </Row>
    </>
  )
}

