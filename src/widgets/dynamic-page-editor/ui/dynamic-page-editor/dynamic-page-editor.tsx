"use client"

import {useRouter} from "next/navigation";
import {App, Button, Drawer, Flex, Grid} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {CSSProperties, MouseEvent, useEffect, useMemo, useRef, useState} from "react";
import {IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import FloatButtonGroup from "../float-button-group/float-button-group";
import DynamicPageHeader from "../dynamic-page-header/dynamic-page-header";
import PageEntityList from "../page-entity-list/page-entity-list";
import AddPageComponentDrawer from "../add-page-component-drawer/add-page-component-drawer";
import PageOutline from "../page-outline/page-outline";

import PageOutlinePanel from "../page-outline-panel/page-outline-panel";
import PagePreview from "../page-preview/page-preview";
import {markClickHandled} from "../editor-block-frame/editor-block-frame";
import {PageEditorContext} from "../../context/page-editor-context";
import {scrollToPageEntity} from "@/entities/dynamic-page/utilities/page-entity-element-id";
import {useLocalStorage} from "@/shared/hooks/use-local-storage";
import {useQueryState} from "nuqs";
import {useBrokenLinksCheck} from "../../hooks/use-broken-links-check";
import {useMainHeadingCheck} from "../../hooks/use-main-heading-check";
import RevisionPreviewBar from "../revision-preview-bar/revision-preview-bar";
import MainHeadingBar from "../main-heading-bar/main-heading-bar";
import type {IPageMainHeadingSource} from "../../model/main-heading-issue";
import {compareBlocks, RevisionHistoryDrawer} from "@/features/revision-history";
import {IRevision, IRevisionComparison, RevisionCollection} from "@/shared/types/revision";

const HEADER_HEIGHT = 64;

interface IProps {
  entities: IPageEntity[];
  setEntities: (value:IPageEntity[]) => void;
  saveEntities: (entities: IPageEntity[]) => Promise<void>;
  history?: {collection: RevisionCollection, recordId: string};
  mainHeading: IPageMainHeadingSource;
}

export default function DynamicPageEditor(props: IProps) {
  const router = useRouter()
  const {notification, modal} = App.useApp();

  const [initialState, setInitialState] = useState<IPageEntity[]>(props.entities)

  const isChanged = useMemo(() => {
    if (props.entities.length != initialState.length)
      return true;

    for (let i = 0; i < props.entities.length; i++) {
      if (JSON.stringify(initialState[i]) != JSON.stringify(props.entities[i]))
        return true;
    }

    return false;
  }, [props.entities, initialState]);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isAddPageComponentDrawerOpen, setIsAddPageComponentDrawerOpen] = useState<boolean>(false);
  const [isOutlineOpen, setIsOutlineOpen] = useLocalStorage<boolean>("isPageOutlineOpen", true);

  const isOutlineFloating = Grid.useBreakpoint().lg == true;
  const [isOutlineDrawerOpen, setIsOutlineDrawerOpen] = useState<boolean>(false);

  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [previewComparison, setPreviewComparison] = useState<IRevisionComparison | null>(null);

  const previewChanges = useMemo(() => previewComparison && previewComparison.previous ?
    compareBlocks(previewComparison.previous.data.entities, previewComparison.revision.data.entities) : [], [previewComparison]);

  const previewHighlights = useMemo(() => {
    const highlights = new Map<string, "added" | "changed">();

    for (const change of previewChanges) {
      if (change.status == "removed")
        continue;

      const id = change.groupId ?? change.id;

      if (highlights.get(id) != "added")
        highlights.set(id, change.groupId ? "changed" : change.status);
    }

    return highlights;
  }, [previewChanges]);

  const restoreRevisionBlocks = (revision: IRevision) => {
    props.setEntities((revision.data.entities ?? []) as IPageEntity[]);
    setPreviewComparison(null);
    setIsHistoryOpen(false);
    setIsPreview(false);
    notification.info({title: "Блоки версії завантажено", description: "Збережіть сторінку, щоб застосувати їх, або відмініть зміни"});
  }
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useQueryState("block", {history: "replace"});

  const edit = (id: string | null) => {
    void setEditingId(id);

    if (id)
      setSelectedId(() => id);
  }

  useEffect(() => {
    if (!editingId)
      return;

    const exists = props.entities.some((entity) => entity.id == editingId || (
      entity.type == "group" && (entity as IPageComponentGroup).components.some((component) => component.id == editingId)
    ));

    if (!exists) {
      void setEditingId(null);
      return;
    }

    setSelectedId(() => editingId);
    setTimeout(() => scrollToPageEntity(editingId));
  }, []);

  useEffect(() => {
    if (!isChanged)
      return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isChanged]);

  const isChangedRef = useRef<boolean>(isChanged);
  isChangedRef.current = isChanged;

  const isLinksBlocked = !isPreview && !previewComparison;

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas)
      return;

    const onClick = (event: globalThis.MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");

      if (!(anchor instanceof HTMLAnchorElement) || !canvas.contains(anchor))
        return;

      if (isLinksBlocked) {
        event.preventDefault();
        event.stopPropagation();

        const frameId = anchor.closest<HTMLElement>("[data-editor-frame-id]")?.dataset.editorFrameId;

        if (frameId)
          setSelectedId(() => frameId);

        return;
      }

      const isNewTab = anchor.target == "_blank" || anchor.hasAttribute("download") ||
        event.button != 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

      if (isNewTab || !isChangedRef.current)
        return;

      event.preventDefault();
      event.stopPropagation();

      const href = anchor.href;

      modal.confirm({
        title: "Перейти за посиланням",
        content: "У редакторі є незбережені зміни. Ви впевнені, що хочете вийти?",
        okText: "Так",
        cancelText: "Ні",
        onOk: () => {
          const url = new URL(href, window.location.href);

          if (url.origin == window.location.origin)
            router.push(url.pathname + url.search + url.hash);
          else
            window.location.assign(href);
        }
      });
    }

    canvas.addEventListener("click", onClick, true);
    return () => canvas.removeEventListener("click", onClick, true);
  }, [isLinksBlocked, modal, router]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key == "Escape")
        setSelectedId(() => null);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const onPageClick = (event: MouseEvent) => {
    if (markClickHandled(event))
      setSelectedId(() => null);
  }

  const updateEntities = (entities: IPageEntity[]) => {
    props.setEntities(entities);
  }

  const updateEntity = (entity: IPageEntity, index: number) => {
    props.setEntities([...props.entities.slice(0, index), entity, ...props.entities.slice(index + 1)]);
  }

  const addEntity = (entity: IPageEntity) => {
    const id = crypto.randomUUID();

    props.setEntities([...props.entities, {...entity, id}]);
    setSelectedId(() => id);
    setTimeout(() => scrollToPageEntity(id));
  }

  const removeEntity = (index: number) => {
    props.setEntities([...props.entities.slice(0, index), ...props.entities.slice(index + 1)]);
  }

  const replaceEntity = (index: number, entities: IPageEntity[]) => {
    props.setEntities([...props.entities.slice(0, index), ...entities, ...props.entities.slice(index + 1)]);
  }

  const cancelChanges = () => {
    modal.confirm({
      title: "Відмінити зміни",
      content: "Ви впевнені що хочете відмінити зміни?",
      okText: "Так",
      cancelText: "Ні",
      onOk: () => {
        props.setEntities(initialState);
      }
    });
  }

  const openBlock = (componentId: string) => {
    setIsPreview(false);
    edit(componentId);
    setTimeout(() => scrollToPageEntity(componentId));
  }

  const checkMainHeading = useMainHeadingCheck(props.mainHeading, openBlock);
  const checkBrokenLinks = useBrokenLinksCheck(openBlock);

  const saveChanges = async () => {
    if (isSaving)
      return;

    const entities = props.entities;

    setIsSaving(true);

    if (!await checkMainHeading(entities) || !await checkBrokenLinks(entities)) {
      setIsSaving(false);
      return;
    }

    props.saveEntities(entities)
      .then(() => {
        notification.success({
          title: "Успішно збережено"
        });

        setInitialState(entities);

        setTimeout(() => {
          router.refresh();
        }, 500);
      })
      .catch((error) => {
        notification.error({
          title: "Помилка збереження",
          description: error.message
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  }

  const outline = (onSelect?: () => void) => (
    <PageOutline
      entities={props.entities}
      updateEntities={updateEntities}
      topOffset={HEADER_HEIGHT}
      onSelect={onSelect}
    />
  );

  const outlineAddButton = (onClick?: () => void) => !isPreview && (
    <Button
      type="dashed"
      block
      icon={<PlusOutlined/>}
      onClick={() => {
        onClick?.();
        setIsAddPageComponentDrawerOpen(true);
      }}
    >
      Додати блок
    </Button>
  );

  return (
    <PageEditorContext value={{selectedId, select: setSelectedId, highlightedId, highlight: setHighlightedId, editingId, edit}}>
      <DynamicPageHeader
        isChanged={isChanged}
        isSaving={isSaving}
        cancelChanges={cancelChanges}
        saveChanges={saveChanges}
        isOutlineOpen={isOutlineFloating ? isOutlineOpen : isOutlineDrawerOpen}
        toggleOutline={() => isOutlineFloating ? setIsOutlineOpen(!isOutlineOpen) : setIsOutlineDrawerOpen(!isOutlineDrawerOpen)}
        isPreview={isPreview}
        togglePreview={() => setIsPreview(!isPreview)}
        openHistory={props.history ? () => setIsHistoryOpen(true) : undefined}
      />
      {isOutlineFloating ? (
        <PageOutlinePanel open={isOutlineOpen} topOffset={HEADER_HEIGHT} footer={outlineAddButton()}>
          {outline()}
        </PageOutlinePanel>
      ) : (
        <Drawer
          title="Структура сторінки"
          placement="bottom"
          size="70vh"
          open={isOutlineDrawerOpen}
          onClose={() => setIsOutlineDrawerOpen(false)}
          styles={{body: {padding: 8}, footer: {padding: 8}}}
          footer={outlineAddButton(() => setIsOutlineDrawerOpen(false)) || null}
        >
          {outline(() => setIsOutlineDrawerOpen(false))}
        </Drawer>
      )}
      <div ref={canvasRef}>
        {previewComparison ? (
          <>
            <RevisionPreviewBar
              createdAt={previewComparison.revision.createdAt}
              authorName={previewComparison.revision.authorName}
              changes={previewComparison.previous ? previewChanges : undefined}
              onRestore={() => restoreRevisionBlocks(previewComparison.revision)}
              onClose={() => setPreviewComparison(null)}
            />
            <PagePreview
              entities={(previewComparison.revision.data.entities ?? []) as IPageEntity[]}
              highlights={previewHighlights}
            />
          </>
        ) : isPreview ? (
          <PagePreview entities={props.entities}/>
        ) : (
          <Flex
            vertical
            style={{overflowX: "clip", paddingTop: 24, "--page-editor-header-height": `${HEADER_HEIGHT}px`} as CSSProperties}
            onClick={onPageClick}
          >
            <MainHeadingBar entities={props.entities} mainHeading={props.mainHeading}/>
            <PageEntityList
              entities={props.entities}
              updateEntities={updateEntities}
              updateEntity={updateEntity}
              removeEntity={removeEntity}
              replaceEntity={replaceEntity}
            />
            <Flex vertical gap="small" style={{padding: "12px"}}>
              <Button block type="dashed" size="large" onClick={() => setIsAddPageComponentDrawerOpen(true)}>
                Додати новий блок
              </Button>
            </Flex>
          </Flex>
        )}
      </div>
      <FloatButtonGroup
        setIsAddPageComponentDrawerOpen={setIsAddPageComponentDrawerOpen}
        canAdd={!isPreview}
      />
      <AddPageComponentDrawer
        isOpen={isAddPageComponentDrawerOpen}
        setIsOpen={setIsAddPageComponentDrawerOpen}
        addEntity={addEntity}
        showGroupComponent={true}
      />
      {props.history && (
        <RevisionHistoryDrawer
          collection={props.history.collection}
          recordId={isHistoryOpen ? props.history.recordId : null}
          onClose={() => setIsHistoryOpen(false)}
          fieldLabels={{}}
          mode="blocks"
          onPreviewBlocks={(comparison) => {
            setPreviewComparison(comparison);
            setIsHistoryOpen(false);
            window.scrollTo({top: 0});
          }}
          onRestoreBlocks={restoreRevisionBlocks}
        />
      )}
    </PageEditorContext>
  )
}
