import RevisionHistoryDrawer from "./ui/revision-history-drawer/revision-history-drawer";
import RevisionLog from "./ui/revision-log/revision-log";
import TrashList from "./ui/trash-list/trash-list";
import {getRevisionAction, getRevisionComparisonAction, getRevisionLogAction, getRevisionsAction, restoreRevisionAction} from "./actions/actions";
import {compareBlocks} from "./utilities/compare-revisions";
import {REVISION_TABLES} from "./model/revision-tables";
import type {BlockChangeStatus, IBlockChange} from "./utilities/compare-revisions";

export type {BlockChangeStatus, IBlockChange};
export {RevisionHistoryDrawer, RevisionLog, TrashList, getRevisionLogAction, getRevisionAction, getRevisionComparisonAction, getRevisionsAction, restoreRevisionAction, compareBlocks, REVISION_TABLES};
