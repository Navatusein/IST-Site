import {useState} from "react";
import {App, Button, Card, Empty, Flex, Form, Popover, Segmented, Switch, theme, Tooltip} from "antd";
import {DeleteOutlined, ExportOutlined, PlusOutlined, SettingOutlined, UngroupOutlined} from "@ant-design/icons";
import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import {MAX_PAGE_GROUP_COMPONENTS} from "@/entities/dynamic-page/types/type";
import {getPageEntityElementId} from "@/entities/dynamic-page/utilities/page-entity-element-id";
import PageComponentRendererEditor from "../page-component-renderer-editor/page-component-renderer-editor";
import {PageGroupGrid} from "@/entities/dynamic-page/ui";
import {ComponentCol, DraggableList, moveItem} from "@/shared/ui-kit";
import AddPageComponentDrawer from "../add-page-component-drawer/add-page-component-drawer";
import WidthControl from "../width-control/width-control";
import EditorBlockFrame from "../editor-block-frame/editor-block-frame";
import ColumnSpanControl from "../column-span-control/column-span-control";
import {fromGroupCell, toGroupCell} from "../../model/page-group-cells";
import {getPageGroupLabel} from "../../model/get-page-group-label";

interface IProps {
  group: IPageComponentGroup;
  index: number;
  updateEntity: (value: IPageEntity, index: number) => void;
  removeEntity: (index: number) => void;
  replaceEntity: (index: number, entities: IPageEntity[]) => void;
}

export default function PageGroupEditor(props: IProps) {
  const {token: {padding, paddingXS, paddingSM, paddingLG}} = theme.useToken();
  const {modal} = App.useApp();

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState<boolean>(false);

  const components = props.group.components;
  const label = getPageGroupLabel(props.group);

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
    updateComponents([...components, toGroupCell({...entity, id: crypto.randomUUID()} as IBasePageComponent, components)]);
  }

  const moveOut = (index: number) => {
    props.replaceEntity(props.index, [
      {...props.group, components: components.filter((_, i) => i != index)} as IPageComponentGroup,
      fromGroupCell(components[index])
    ]);
  }

  const ungroup = () => {
    modal.confirm({
      title: "Розгрупувати",
      content: "Блоки розмітки стануть окремими блоками сторінки, один під одним.",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => props.replaceEntity(props.index, components.map(fromGroupCell))
    });
  }

  const onRemove = () => {
    modal.confirm({
      title: "Видалити розмітку",
      content: components.length != 0 ?
        `Розмітку буде видалено разом з блоками (${components.length}). Щоб зберегти блоки, спочатку розгрупуйте її.` :
        "Ви впевнені що хочете видалити цю розмітку?",
      okText: "Так",
      cancelText: "Ні",
      okButtonProps: {danger: true},
      onOk: () => props.removeEntity(props.index)
    });
  }

  const settings = (
    <Form layout="vertical" style={{width: 280}}>
      <Form.Item label="Блоки в картках" extra="Картки в одному рядку однакової висоти" style={{marginBottom: paddingSM}}>
        <Switch checked={props.group.cards == true} onChange={(cards) => updateGroup({cards})}/>
      </Form.Item>
      <Form.Item label="Вертикальне вирівнювання" extra="Для блоків різної висоти в одному рядку" style={{marginBottom: 0}}>
        <Segmented
          block
          options={[
            {value: "top", label: "По верху"},
            {value: "center", label: "По центру"},
          ]}
          value={props.group.verticalAlign ?? "top"}
          onChange={(value) => updateGroup({verticalAlign: value as IPageComponentGroup["verticalAlign"]})}
        />
      </Form.Item>
    </Form>
  );

  const toolbar = (
    <>
      <DraggableList.Handle size="small"/>
      <Popover content={settings} trigger="click" title="Налаштування розмітки">
        <Tooltip title="Налаштування розмітки">
          <Button type="text" size="small" icon={<SettingOutlined/>} aria-label="Налаштування розмітки"/>
        </Tooltip>
      </Popover>
      <WidthControl
        value={props.group.width}
        onChange={(width) => updateGroup({width})}
        compact
        size="small"
        type="text"
        tooltip="Змінити розмір розмітки"
      />
      <Tooltip title="Розгрупувати: зробити блоки розмітки окремими блоками сторінки">
        <Button type="text" size="small" icon={<UngroupOutlined/>} onClick={ungroup} disabled={components.length == 0} aria-label="Розгрупувати"/>
      </Tooltip>
      <Tooltip title="Видалити розмітку">
        <Button type="text" size="small" danger icon={<DeleteOutlined/>} onClick={onRemove} aria-label="Видалити розмітку"/>
      </Tooltip>
    </>
  );

  return (
    <DraggableList.Item
      index={props.index}
      id={getPageEntityElementId(props.group.id)}
      style={{scrollMarginTop: 80}}
      renderPreview={() => <Card size="small">{label}</Card>}
    >
      <Flex vertical>
        <ComponentCol width={props.group.width}>
          <EditorBlockFrame id={props.group.id} label={label} toolbar={toolbar} kind="row">
            <Flex vertical gap={padding} style={{paddingTop: paddingXS}}>
              {components.length == 0 ? (
                <Empty description="Розмітка порожня, додайте до неї блоки" image={Empty.PRESENTED_IMAGE_SIMPLE}/>
              ) : (
                <DraggableList
                  horizontal
                  count={components.length}
                  onReorder={(startIndex, finishIndex) => updateComponents(moveItem(components, startIndex, finishIndex))}
                >
                  <PageGroupGrid
                    group={props.group}
                    rowGap={paddingLG}
                    renderCell={(component, index) => (
                      <PageComponentRendererEditor
                        component={component}
                        index={index}
                        updateComponent={updateComponent}
                        removeComponent={removeComponent}
                        allowChangeSize={false}
                        group={props.group}
                        extraActions={
                          <>
                            <ColumnSpanControl
                              value={component.columnSpan}
                              onChange={(columnSpan) => updateComponent({...component, columnSpan}, index)}
                            />
                            <Tooltip title="Винести з розмітки">
                              <Button type="text" size="small" icon={<ExportOutlined/>} onClick={() => moveOut(index)} aria-label="Винести з розмітки"/>
                            </Tooltip>
                          </>
                        }
                      />
                    )}
                  />
                </DraggableList>
              )}
              {components.length < MAX_PAGE_GROUP_COMPONENTS && (
                <Button type="dashed" size="small" block icon={<PlusOutlined/>} onClick={() => setIsAddDrawerOpen(true)}>
                  Додати блок у розмітку
                </Button>
              )}
            </Flex>
            <AddPageComponentDrawer
              isOpen={isAddDrawerOpen}
              setIsOpen={setIsAddDrawerOpen}
              addEntity={addComponent}
              title="Додати блок у розмітку"
              filter={(descriptor) => descriptor.allowInRow == true}
            />
          </EditorBlockFrame>
        </ComponentCol>
      </Flex>
    </DraggableList.Item>
  )
}
