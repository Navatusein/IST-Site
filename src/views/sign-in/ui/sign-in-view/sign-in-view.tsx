"use client"

import {SignInForm} from "@/features/sign-in-form";
import {Col, Flex, Image, Row} from "antd";
import style from "./sign-in-view.module.scss"

interface IProps {

}

export default function SignInView(props: IProps) {
  return (
    <Row style={{height: "100svh"}}>
      <Col span={0} className={style.imageContainer}>
        <Image src="/red-corps.webp" height="100%" preview={false} className={style.image}/>
      </Col>
      <Col span={24}>
        <Flex style={{height: "100%", width: "100%"}} justify="center" align="center">
          <SignInForm/>
        </Flex>
      </Col>
    </Row>
  );
}