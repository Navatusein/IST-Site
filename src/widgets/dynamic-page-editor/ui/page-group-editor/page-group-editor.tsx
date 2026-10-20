import {useState} from "react";
import {App, Button, Card, Col, Empty, Flex, Grid, Popover, Row, Segmented, theme, Tooltip, Typography} from "antd";
import {DeleteOutlined, ExportOutlined, PlusOutlined, SettingOutlined, UngroupOutlined} from "@ant-design/icons";
import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import {MAX_PAGE_GROUP_COMPONENTS} from "@/entities/dynamic-page/types/type";
import {getGroupColumnSpans} from "@/entities/dynamic-page/utilities/get-group-column-spans";
import {getPageEntityElementId} from "@/entities/dynamic-page/utilities/page-entity-element-id";
import PageComponentRendererEditor from "../page-component-renderer-editor/page-component-renderer-editor";
import {ComponentCol, DraggableList, moveItem} from "@/shared/ui-kit";
import AddPageComponentDrawer from "../add-page-component-drawer/add-page-component-drawer";
import WidthControl from "../width-control/width-control";

interface IProps {
  group: IPageComponentGroup;
  index: number;
  updateEntity: (value: IPageEntity, index: number) => void;
  removeEntity: (index: number) => void;
  replaceEntity: (index: number, entities: IPageEntity[]) => void;
}

export default function PageGroupEditor(props: IProps) {
  const {token: {padding, paddingXS, colorBorder, borderRadiusLG}} = theme.useToken();
  const {modal} = App.useApp();

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState<boolean>(false);

  const isNarrow = Grid.useBreakpoint().md != true;

  const components = props.group.components;
  const columns = getGroupColumnSpans(props.group);

  const updateGroup = (value: Partial<IPageComponentGroup>) => {
    props.updateEntity({...props.group, ...value} as IPageComponentGroup, props.index);
  }

  const updateComponents = (value: IBasePageComponent[]) => updateGroup({components: value});

  const updateComponent = (value: IBasePageComponent, index: number) => {
    updateComponents(components.map((component, i) => i == index ? value : component));
  }

  const removeComponent = (index: number) => {
    updateComponents(components.filter((_, i) => i != index));
  }

  const addComponent = (entity: IPageEntity) => {
    updateComponents([...components, {...entity, id: crypto.randomUUID()} as IBasePageComponent]);
  }

  const moveOut = (index: number) => {
    props.replaceEntity(props.index, [
      {...props.group, components: components.filter((_, i) => i != index)} as IPageComponentGroup,
      components[index]
    ]);
  }

  const ungroup = () => {
    modal.confirm({
      title: "Розгрупувати",
      content: "Блоки ряду стануть окремими блоками сторінки, один під одним.",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => props.replaceEntity(props.index, components)
    });
  }

  const onRemove = () => {
    modal.confirm({
      title: "Видалити ряд",
      content: components.length != 0 ?
        `Ряд буде видалено разом з блоками (${components.length}). Щоб зберегти блоки, спочатку розгрупуйте ряд.` :
        "Ви впевнені що хочете видалити цей ряд?",
      okText: "Так",
      cancelText: "Ні",
      okButtonProps: {danger: true},
      onOk: () => props.removeEntity(props.index)
    });
  }

  const settings = (
    <Flex vertical gap="small" style={{width: 260}}>
      <Typography.Text strong>Пропорції колонок</Typography.Text>
      <Segmented
        block
        options={[
          {value: "equal", label: "Рівні"},
          {value: "1:2", label: "1 : 2"},
          {value: "2:1", label: "2 : 1"},
        ]}
        value={props.group.proportions ?? "equal"}
        disabled={components.length != 2}
        onChange={(value) => updateGroup({proportions: value as IPageComponentGroup["proportions"]})}
      />
      {components.length != 2 && (
        <Typography.Text type="secondary" style={{fontSize: 12}}>
          Пропорції можна змінити, коли в ряду два блоки
        </Typography.Text>
      )}
      <Typography.Text strong>Вертикальне вирівнювання</Typography.Text>
      <Segmented
        block
        options={[
          {value: "top", label: "По верху"},
          {value: "center", label: "По центру"},
        ]}
        value={props.group.verticalAlign ?? "top"}
        onChange={(value) => updateGroup({verticalAlign: value as IPageComponentGroup["verticalAlign"]})}
      />
    </Flex>
  );

  return (
    <DraggableList.Item
      index={props.index}
      id={getPageEntityElementId(props.group.id)}
      style={{scrollMarginTop: 80}}
      renderPreview={() => <Card size="small">{`Ряд (${components.length})`}</Card>}
    >
      <Flex vertical style={{marginBottom: paddingXS}}>
        <ComponentCol width={props.group.width}>
          <div style={{border: `1px dashed ${colorBorder}`, borderRadius: borderRadiusLG, padding: paddingXS}}>
            <Flex vertical gap="small">
              {components.length == 0 ? (
                <Empty description="Ряд порожній, додайте до нього блоки" image={Empty.PRESENTED_IMAGE_SIMPLE}/>
              ) : (
                <DraggableList
                  horizontal
                  count={components.length}
                  onReorder={(startIndex, finishIndex) => updateComponents(moveItem(components, startIndex, finishIndex))}
                >
                  <Row gutter={[padding, padding]} align={props.group.verticalAlign == "center" ? "middle" : "top"}>
                    {components.map((component, index) => (
                      <Col key={component.id} {...columns[index]}>
                        <PageComponentRendererEditor
                          component={component}
                          index={index}
                          updateComponent={updateComponent}
                          removeComponent={removeComponent}
                          allowChangeSize={false}
                          inline
                          extraActions={
                            <Tooltip title="Винести з ряду">
                              <Button icon={<ExportOutlined/>} onClick={() => moveOut(index)}/>
                            </Tooltip>
                          }
                        />
                      </Col>
                    ))}
                  </Row>
                </DraggableList>
              )}
              {components.length < MAX_PAGE_GROUP_COMPONENTS && (
                <Button type="dashed" block icon={<PlusOutlined/>} onClick={() => setIsAddDrawerOpen(true)}>
                  Додати блок у ряд
                </Button>
              )}
            </Flex>
          </div>
        </ComponentCol>
        <Card variant="borderless" size="small" style={{width: "fit-content", maxWidth: "100%", marginTop: paddingXS, alignSelf: "center"}}>
          <Flex gap={isNarrow ? 6 : "small"} wrap justify="center" align="center">
            <DraggableList.Handle type="default"/>
            <Popover content={settings} trigger="click" title="Налаштування ряду">
              <Button icon={<SettingOutlined/>} aria-label="Налаштування ряду">{!isNarrow && "Налаштування"}</Button>
            </Popover>
            <WidthControl
              value={props.group.width}
              onChange={(width) => updateGroup({width})}
              compact={isNarrow}
              tooltip="Змінити розмір ряду"
            />
            <Tooltip title="Зробити блоки ряду окремими блоками сторінки">
              <Button icon={<UngroupOutlined/>} onClick={ungroup} disabled={components.length == 0} aria-label="Розгрупувати">
                {!isNarrow && "Розгрупувати"}
              </Button>
            </Tooltip>
            <Tooltip title="Видалити ряд">
              <Button danger icon={<DeleteOutlined/>} onClick={onRemove} aria-label="Видалити ряд">
                {!isNarrow && "Видалити"}
              </Button>
            </Tooltip>
          </Flex>
        </Card>
      </Flex>
      <AddPageComponentDrawer
        isOpen={isAddDrawerOpen}
        setIsOpen={setIsAddDrawerOpen}
        addEntity={addComponent}
        title="Додати блок у ряд"
        filter={(descriptor) => descriptor.allowInRow == true}
      />
    </DraggableList.Item>
  )
}
