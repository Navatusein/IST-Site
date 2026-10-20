import {IBasePageComponent, IPageComponentGroup, IPageEntity} from "@/entities/dynamic-page";
import type {IRichTextPageComponent} from "@/page-components/rich-text/types/type";
import richTextToPlainText from "@/shared/utilities/rich-text-to-plain-text";

const DESCRIPTION_LENGTH = 160;

export function getPageDescription(entities: IPageEntity[]): string | undefined {
  const components = entities.flatMap((entity) => (
    entity.type == "group" ? (entity as IPageComponentGroup).components : [entity as IBasePageComponent]
  ));

  for (const component of components) {
    if (component.componentType != "rich-text")
      continue;

    const text = richTextToPlainText((component as IRichTextPageComponent).text);

    if (text)
      return text.length > DESCRIPTION_LENGTH ? text.slice(0, DESCRIPTION_LENGTH - 1).trimEnd() + "…" : text;
  }

  return undefined;
}
