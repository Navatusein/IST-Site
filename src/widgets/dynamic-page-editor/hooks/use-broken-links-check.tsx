"use client"

import {App, Button, Flex, Tag, theme, Tooltip, Typography} from "antd";
import {EditOutlined, ExclamationCircleFilled} from "@ant-design/icons";
import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import {usePageComponentRegistry} from "@/entities/dynamic-page/model";
import {findBrokenPageLinksAction, IBrokenPageLink} from "@/features/site-links";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";

function getComponents(entities: IPageEntity[]): IBasePageComponent[] {
  return entities.flatMap((entity) => entity.type == "group" ? (entity as IPageComponentGroup).components : [entity as IBasePageComponent]);
}

export function useBrokenLinksCheck(openBlock: (componentId: string) => void) {
  const {modal} = App.useApp();
  const {token} = theme.useToken();
  const registry = usePageComponentRegistry();

  return async (entities: IPageEntity[]): Promise<boolean> => {
    let brokenLinks: IBrokenPageLink[];

    try {
      brokenLinks = await unwrapServerAction(findBrokenPageLinksAction(entities));
    }
    catch {
      return true;
    }

    if (brokenLinks.length == 0)
      return true;

    const components = getComponents(entities);
    const getBlockName = (componentId?: string) => {
      const component = components.find((item) => item.id == componentId);
      return component ? registry.getDescriptor(component.componentType)?.name ?? "Блок" : "Блок";
    }

    const rows = brokenLinks.filter((link, index) => (
      brokenLinks.findIndex((other) => other.componentId == link.componentId && other.path == link.path) == index
    ));

    return new Promise<boolean>((resolve) => {
      const instance = modal.confirm({
        icon: null,
        title: (
          <Flex align="center" gap="small">
            <ExclamationCircleFilled style={{color: token.colorWarning, fontSize: 22}}/>
            {rows.length == 1 ? "На сторінці є бите посилання" : `На сторінці є биті посилання (${rows.length})`}
          </Flex>
        ),
        width: 520,
        okText: "Зберегти все одно",
        cancelText: "Виправити",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
        content: (
          <Flex vertical gap="small" style={{marginTop: token.marginXS}}>
            <Typography.Text type="secondary">
              Сторінок, на які вони ведуть, немає на сайті. Виправте посилання або збережіть сторінку як є
            </Typography.Text>
            <Flex vertical gap={6}>
              {rows.map((link) => (
                <Flex
                  key={`${link.componentId}-${link.path}`}
                  align="center"
                  gap="small"
                  style={{
                    padding: `${token.paddingXS}px ${token.paddingSM}px`,
                    borderRadius: token.borderRadiusLG,
                    border: `1px solid ${token.colorErrorBorder}`,
                    background: token.colorErrorBg
                  }}
                >
                  <Tag color="error" style={{marginInlineEnd: 0, flexShrink: 0, background: token.colorBgContainer}}>Блок</Tag>
                  <Flex vertical gap={2} style={{flex: 1, minWidth: 0}}>
                    <Typography.Text strong ellipsis>{getBlockName(link.componentId)}</Typography.Text>
                    <Typography.Text type="danger" ellipsis style={{fontSize: 12}}>Веде на {link.path}</Typography.Text>
                  </Flex>
                  {link.componentId && (
                    <Tooltip title="Відкрити блок у редакторі">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined/>}
                        aria-label="Відкрити блок у редакторі"
                        onClick={() => {
                          instance.destroy();
                          resolve(false);
                          openBlock(link.componentId!);
                        }}
                      />
                    </Tooltip>
                  )}
                </Flex>
              ))}
            </Flex>
          </Flex>
        )
      });
    });
  }
}
