import {Editor} from "@tiptap/react";
import {Button, Card, Flex, Select, Space, Tooltip} from "antd";
import {
  BoldOutlined, ClearOutlined, CloseCircleOutlined, CommentOutlined, CopyOutlined, DisconnectOutlined, EnterOutlined,
  ItalicOutlined, LineOutlined, LinkOutlined,
  OrderedListOutlined, RedoOutlined,
  StrikethroughOutlined, UndoOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import {useCallback, useMemo} from "react";

interface IProps {
  editor: Editor|null;
}

const IS_DEV_MODE = process.env.NODE_ENV === "development";

const TEXT_TYPES_OPTIONS = [
  {value: "header-1", label: "Заголовок 1"},
  {value: "header-2", label: "Заголовок 2"},
  {value: "header-3", label: "Заголовок 3"},
  {value: "header-4", label: "Заголовок 4"},
  {value: "header-5", label: "Заголовок 5"},
  {value: "paragraph", label: "Параграф"},
]

export default function ToolBar(props: IProps) {
  if (props.editor == undefined) {
    return null;
  }

  const textTypeOptionValue = useMemo(() => {
    if (props.editor!.isActive("paragraph"))
      return "paragraph"

    if (props.editor!.isActive("heading", {level: 1}))
      return "header-1"

    if (props.editor!.isActive("heading", {level: 2}))
      return "header-2"

    if (props.editor!.isActive("heading", {level: 3}))
      return "header-3"

    if (props.editor!.isActive("heading", {level: 4}))
      return "header-4"

    if (props.editor!.isActive("heading", {level: 5}))
      return "header-5"

    if (props.editor!.isActive("ant-text"))
      return "text"

    return "paragraph"
  }, [props.editor.state]);

  const textTypeOptionOnChange = (value: string) => {
    const [type, attribute] = value.split("-");

    if (type == "paragraph")
      props.editor!.chain().focus().setParagraph().run()

    if (type == "header")
      props.editor!.chain().focus().toggleHeading({level: parseInt(attribute) as never}).run()
  }

  const setLink = useCallback(() => {
    const previousUrl = props.editor!.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null)
      return

    if (url === '') {
      props.editor!.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    props.editor!.chain().focus().extendMarkRange('link').setLink({href: url}).run()
  }, [props.editor])

  return (
    <Card size="small" style={{position: "sticky", top: 0, zIndex: 1000}}>
      <Flex gap="small" wrap>
        <Space.Compact>
          <Tooltip title="Жирний">
            <Button
              onClick={() => props.editor!.chain().focus().toggleBold().run()}
              type={props.editor.isActive("bold") ? "primary" : "default"}
              disabled={!props.editor.can().chain().focus().toggleBold().run()}
              icon={<BoldOutlined/>}
            />
          </Tooltip>
          <Tooltip title="Курсив">
            <Button
              onClick={() => props.editor!.chain().focus().toggleItalic().run()}
              type={props.editor.isActive("italic") ? "primary" : "default"}
              disabled={!props.editor.can().chain().focus().toggleItalic().run()}
              icon={<ItalicOutlined />}
            />
          </Tooltip>
          <Tooltip title="Закреслений">
            <Button
              onClick={() => props.editor!.chain().focus().toggleStrike().run()}
              type={props.editor.isActive("strike") ? "primary" : "default"}
              disabled={!props.editor.can().chain().focus().toggleStrike().run()}
              icon={<StrikethroughOutlined />}
            />
          </Tooltip>
        </Space.Compact>

        <Select
          options={TEXT_TYPES_OPTIONS}
          onChange={textTypeOptionOnChange}
          value={textTypeOptionValue}
          style={{width: 150}}
        />

        <Space.Compact>
          <Tooltip title="Маркований список">
            <Button
              onClick={() => props.editor!.chain().focus().toggleBulletList().run()}
              type={props.editor.isActive("bulletList") ? "primary" : "default"}
              icon={<UnorderedListOutlined />}
            />
          </Tooltip>
          <Tooltip title="Нумерований список">
            <Button
              onClick={() => props.editor!.chain().focus().toggleOrderedList().run()}
              type={props.editor.isActive("orderedList") ? "primary" : "default"}
              icon={<OrderedListOutlined />}
            />
          </Tooltip>
        </Space.Compact>

        <Space.Compact>
          <Tooltip title="Очистити стилі">
            <Button
              onClick={() => props.editor!.chain().focus().unsetAllMarks().run()}
              icon={<ClearOutlined />}
            />
          </Tooltip>
          <Tooltip title="Очистити блоки">
            <Button
              onClick={() => props.editor!.chain().focus().clearNodes().run()}
              icon={<CloseCircleOutlined />}
            />
          </Tooltip>
        </Space.Compact>

        <Tooltip title="Цитата">
          <Button
            onClick={() => props.editor!.chain().focus().toggleBlockquote().run()}
            type={props.editor.isActive("blockquote") ? "primary" : "default"}
            icon={<CommentOutlined/>}
          />
        </Tooltip>

        <Space.Compact>
          {props.editor.isActive("link") ?
            <>
              <Tooltip title="Змінити посилання">
                <Button
                  onClick={setLink}
                  type="primary"
                  icon={<LinkOutlined/>}
                />
              </Tooltip>
              <Tooltip title="Видалити посилання">
                <Button
                  onClick={() => props.editor!.chain().focus().unsetLink().run()}
                  type="default"
                  icon={<DisconnectOutlined/>}
                />
              </Tooltip>
            </> :
            <>
              <Tooltip title="Вставити посилання">
                <Button
                  onClick={setLink}
                  type="default"
                  icon={<LinkOutlined/>}
                />
              </Tooltip>
            </>
          }
        </Space.Compact>

        <Tooltip title="Горизонтальна лінія">
          <Button
            onClick={() => props.editor!.chain().focus().setHorizontalRule().run()}
            icon={<LineOutlined />}
          />
        </Tooltip>

        <Tooltip title="Розрив рядка">
          <Button
            onClick={() => props.editor!.chain().focus().setHardBreak().run()}
            icon={<EnterOutlined />}
          />
        </Tooltip>

        <Space.Compact>
          <Tooltip title="Скасувати">
            <Button
              onClick={() => props.editor!.chain().focus().undo().run()}
              disabled={!props.editor.can().chain().focus().undo().run()}
              icon={<UndoOutlined />}
            />
          </Tooltip>

          <Tooltip title="Повторити">
            <Button
              onClick={() => props.editor!.chain().focus().redo().run()}
              disabled={!props.editor.can().chain().focus().redo().run()}
              icon={<RedoOutlined />}
            />
          </Tooltip>
        </Space.Compact>

        {IS_DEV_MODE &&
          <Tooltip title="Копіювати контент">
            <Button
              onClick={() => {
                window.navigator.clipboard.writeText(JSON.stringify(props.editor?.getJSON()) ?? "")
              }}
              icon={<CopyOutlined />}
            />
          </Tooltip>
        }
      </Flex>
    </Card>
  )
}
