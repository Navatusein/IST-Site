"use client"

import {Card, Col, Empty, Flex, Row, Typography} from "antd";
import {useCurrentUser} from "@/entities/user/hooks/useCurrentUser";
import {useUserPermissions} from "@/entities/user/hooks/useUserPermissions";
import {getAllowedAdminMenuSections} from "@/shared/configs/admin-menu-config";
import {AdminPageHeader} from "@/shared/ui-kit";
import AdminHomeCard from "../admin-home-card/admin-home-card";

export default function AdminHomeView() {
  const user = useCurrentUser();
  const {userPermissions} = useUserPermissions();

  const sections = getAllowedAdminMenuSections(userPermissions);

  return (
    <Card variant="borderless">
      <AdminPageHeader
        title={user ? `Вітаємо, ${user.name}!` : "Вітаємо!"}
        description="Адмінпанель сайту кафедри: оберіть розділ, з яким хочете працювати"
      />
      {sections.length == 0 && (
        <Empty description="У вас поки немає доступу до жодного розділу. Зверніться до адміністратора"/>
      )}
      <Flex vertical gap="large">
        {sections.map((section) => (
          <Flex key={section.title} vertical gap="small">
            <Typography.Title level={4} style={{margin: 0}}>{section.title}</Typography.Title>
            <Row gutter={[16, 16]}>
              {section.items.map((item) => (
                <Col key={item.href} xs={24} sm={12} lg={8} xxl={6}>
                  <AdminHomeCard item={item}/>
                </Col>
              ))}
            </Row>
          </Flex>
        ))}
      </Flex>
    </Card>
  )
}
