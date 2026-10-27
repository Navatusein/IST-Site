import {IDynamicPage} from "@/entities/dynamic-page";
import {Button, TableColumnsType, Tooltip, Tag} from "antd";
import {CrudComponent, timestampColumns} from "@/widgets/crud-component";
import {useMemo, useState} from "react";
import {addDynamicPageAction,
  removeDynamicPagesAction,
  updateDynamicPageAction, exportDynamicPagesAction, importDynamicPagesAction, getDynamicPageByIdAction} from "@/entities/dynamic-page/actions/actions";
import {useRouter} from "next/navigation";
import DynamicPageCrudForm from "../dynamic-page-crud-form/dynamic-page-crud-form";
import {ApartmentOutlined, FormOutlined, HistoryOutlined, LinkOutlined, NodeIndexOutlined, WarningFilled} from "@ant-design/icons";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {stringSorter} from "@/shared/utilities/sorters";

import {IPageResult} from "@/shared/types/page-query";
import {getBrokenLinks, getIncomingLinkCounts, ISiteLinksGraph, PageLinksModal, SiteLinksCheckModal} from "@/features/site-links";
import {REVISION_TABLES, RevisionHistoryDrawer} from "@/features/revision-history";

interface IProps {
  result: IPageResult<IDynamicPage>;
  siteLinks: ISiteLinksGraph;
}

const COLUMNS: TableColumnsType<IDynamicPage> = [
  {
    title: "Назва",
    dataIndex: "name",
    key: "name",
    width: 200,
    sorter: (a, b) => stringSorter(a.name, b.name),
    showSorterTooltip: {
      title: "Сортування за назвою"
    }
  },
  {
    title: "Заголовок",
    dataIndex: "title",
    key: "title",
    width: 200,
    sorter: (a, b) => stringSorter(a.title, b.title),
    showSorterTooltip: {
      title: "Сортування за заголовком"
    }
  },
  {
    title: "Опис",
    dataIndex: "description",
    key: "description",
    width: 300,
    ellipsis: true,
    render: (value?: string) => value || "—"
  },
  {
    title: "Шлях",
    dataIndex: "path",
    key: "path",
    width: 250,
    sorter: (a, b) => stringSorter(a.path, b.path),
    showSorterTooltip: {
      title: "Сортування за шляхом"
    }
  },
];

const getPageKey = (page: IDynamicPage) => `/${page.path}`;

export default function DynamicPageCrud(props: IProps) {
  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<IDynamicPage[]>([]);
  const [historyRecord, setHistoryRecord] = useState<IDynamicPage | null>(null);
  const [linksPageKey, setLinksPageKey] = useState<string | null>(null);
  const [isLinksCheckOpen, setIsLinksCheckOpen] = useState<boolean>(false);

  const brokenLinksCount = getBrokenLinks(props.siteLinks).length;

  const columns = useMemo<TableColumnsType<IDynamicPage>>(() => {
    const incomingCounts = getIncomingLinkCounts(props.siteLinks);

    return [
      ...COLUMNS,
      {
        title: "Посилань",
        key: "links",
        width: 110,
        render: (_, page) => {
          const count = incomingCounts.get(getPageKey(page)) ?? 0;

          return (
            <Tooltip title={count ? "Скільки сторінок і пунктів меню посилаються на цю сторінку" : "На сторінку не веде жодне посилання"}>
              <Tag
                color={count ? "cyan" : "warning"}
                icon={<LinkOutlined/>}
                style={{cursor: "pointer", marginInlineEnd: 0}}
                onClick={(event) => {
                  event.stopPropagation();
                  setLinksPageKey(getPageKey(page));
                }}
              >
                {count}
              </Tag>
            </Tooltip>
          );
        }
      },
      ...timestampColumns<IDynamicPage>()
    ];
  }, [props.siteLinks]);

  const create = async (data: IDynamicPage) => {
    await unwrapServerAction(addDynamicPageAction({...data}));
  }

  const update = async (data: IDynamicPage) => {
    await unwrapServerAction(updateDynamicPageAction(data));
  }

  const remove = async (data: IDynamicPage[]) => {
    await unwrapServerAction(removeDynamicPagesAction(data));
  }

  const redirectToEditPage = (data?: IDynamicPage[]) => {
    if (selectedRows[0] == null && data?.[0] == null)
      return;

    router.push(`/admin/edit-page/dynamic-page/${data?.[0].path ?? selectedRows[0].path}`);
  }

  return (
    <>
      <CrudComponent<IDynamicPage>
        title="Динамічні сторінки"
        description="Сторінки сайту з блоків. Двічі натисніть на рядок, щоб змінити назву, заголовок і шлях, «Редагувати контент» — блоки сторінки. «Посилань» — скільки сторінок і пунктів меню ведуть на сторінку"
        columns={columns}
        data={props.result.items}
        pagination={props.result}
        serverSearch
        importExport={{
          fileName: "dynamic-pages",
          exportRecords: (params) => unwrapServerAction(exportDynamicPagesAction(params)),
          importRecords: (file, apply) => unwrapServerAction(importDynamicPagesAction(file, apply)),
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        create={create}
        update={update}
        remove={remove}
        trash
        getRecord={(id) => unwrapServerAction(getDynamicPageByIdAction(id))}
        getRecordName={(page) => page.name}
        rowActions={[
          {
            key: "edit-content",
            label: "Редагувати контент",
            icon: <FormOutlined/>,
            onClick: (page) => redirectToEditPage([page]),
            primary: true
          },
          {
            key: "links",
            label: "Посилання",
            icon: <LinkOutlined/>,
            onClick: (page) => setLinksPageKey(getPageKey(page))
          },
          {
            key: "history",
            label: "Історія",
            icon: <HistoryOutlined/>,
            onClick: (record) => setHistoryRecord(record)
          }
        ]}
        pageActions={[
          {
            key: "check-links",
            label: "Перевірка посилань",
            icon: <NodeIndexOutlined/>,
            onClick: () => setIsLinksCheckOpen(true)
          },
          {
            key: "site-map",
            label: "Карта сайту",
            icon: <ApartmentOutlined/>,
            onClick: () => router.push("/admin/site-map")
          }
        ]}
        notice={brokenLinksCount != 0 && (
          <Tooltip title="Посилання на сторінки, яких немає на сайті, наприклад після зміни шляху сторінки">
            <Button color="orange" variant="outlined" icon={<WarningFilled/>} onClick={() => setIsLinksCheckOpen(true)}>
              Биті посилання: {brokenLinksCount}
            </Button>
          </Tooltip>
        )}
      >
        <DynamicPageCrudForm/>
      </CrudComponent>
      <RevisionHistoryDrawer
        collection="dynamic-pages"
        recordId={historyRecord ? String(historyRecord._id) : null}
        recordName={historyRecord ? historyRecord.name : undefined}
        onClose={() => setHistoryRecord(null)}
        fieldLabels={REVISION_TABLES["dynamic-pages"].fieldLabels}
        mode="record"
        onRestored={() => router.refresh()}
      />
      <PageLinksModal graph={props.siteLinks} pageKey={linksPageKey} onClose={() => setLinksPageKey(null)}/>
      <SiteLinksCheckModal graph={props.siteLinks} open={isLinksCheckOpen} onClose={() => setIsLinksCheckOpen(false)}/>
    </>
  )
}