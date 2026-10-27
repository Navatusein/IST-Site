"use client"

import {App, Button, Flex, Tag, theme, Tooltip, Typography} from "antd";
import {EditOutlined, ExclamationCircleFilled, InfoCircleFilled} from "@ant-design/icons";
import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import {getPageMainHeadings, usePageComponentRegistry} from "@/entities/dynamic-page/model";
import {
  getMainHeadingIssue,
  getMainHeadingIssueHint,
  getMainHeadingIssueTitle,
  IPageMainHeadingSource
} from "../model/main-heading-issue";

function getComponents(entities: IPageEntity[]): IBasePageComponent[] {
  return entities.flatMap((entity) => entity.type == "group" ? (entity as IPageComponentGroup).components : [entity as IBasePageComponent]);
}

export function useMainHeadingCheck(source: IPageMainHeadingSource, openBlock: (componentId: string) => void) {
  const {modal} = App.useApp();
  const {token} = theme.useToken();
  const registry = usePageComponentRegistry();

  return (entities: IPageEntity[]): Promise<boolean> => {
    const issue = getMainHeadingIssue(getPageMainHeadings(entities, registry), source);

    if (!issue)
      return Promise.resolve(true);

    const components = getComponents(entities);
    const getBlockName = (componentId: string) => {
      const component = components.find((item) => item.id == componentId);
      return component ? registry.getDescriptor(component.componentType)?.name ?? "Блок" : "Блок";
    }

    const isMissing = issue.type == "missing";

    return new Promise<boolean>((resolve) => {
      const instance = modal.confirm({
        icon: null,
        title: (
          <Flex align="center" gap="small">
            {isMissing ?
              <InfoCircleFilled style={{color: token.colorInfo, fontSize: 22}}/> :
              <ExclamationCircleFilled style={{color: token.colorWarning, fontSize: 22}}/>}
            {getMainHeadingIssueTitle(issue, source)}
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
              {getMainHeadingIssueHint(issue, source)}. Пошукові системи очікують на сторінці один заголовок 1 рівня
            </Typography.Text>
            {!isMissing && (
              <Flex vertical gap={6}>
                {issue.headings.map((heading, index) => (
                  <Flex
                    key={`${heading.componentId}-${index}`}
                    align="center"
                    gap="small"
                    style={{
                      padding: `${token.paddingXS}px ${token.paddingSM}px`,
                      borderRadius: token.borderRadiusLG,
                      border: `1px solid ${token.colorWarningBorder}`,
                      background: token.colorWarningBg
                    }}
                  >
                    <Tag color="warning" style={{marginInlineEnd: 0, flexShrink: 0, background: token.colorBgContainer}}>H1</Tag>
                    <Flex vertical gap={2} style={{flex: 1, minWidth: 0}}>
                      <Typography.Text strong ellipsis>{getBlockName(heading.componentId)}</Typography.Text>
                      <Typography.Text type="secondary" ellipsis style={{fontSize: 12}}>«{heading.text || "без тексту"}»</Typography.Text>
                    </Flex>
                    <Tooltip title="Відкрити блок у редакторі">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined/>}
                        aria-label="Відкрити блок у редакторі"
                        onClick={() => {
                          instance.destroy();
                          resolve(false);
                          openBlock(heading.componentId);
                        }}
                      />
                    </Tooltip>
                  </Flex>
                ))}
              </Flex>
            )}
          </Flex>
        )
      });
    });
  }
}
