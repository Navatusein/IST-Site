"use client"

import {useEffect, useState} from "react";
import {IPageEntity} from "@/entities/dynamic-page";
import {
  getPageEntityElementId,
  getPageEntityIdFromElementId
} from "@/entities/dynamic-page/utilities/page-entity-element-id";

const IGNORED_BOTTOM_AREA = "70%";

export function useActivePageEntity(entities: IPageEntity[], topOffset: number) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const entityIds = entities.map((entity) => entity.id).join();

  useEffect(() => {
    const observer = new IntersectionObserver((records) => {
      const visible = records.find((record) => record.isIntersecting);
      const id = visible && getPageEntityIdFromElementId(visible.target.id);

      if (id)
        setActiveId(() => id);
    }, {rootMargin: `-${topOffset}px 0px -${IGNORED_BOTTOM_AREA} 0px`});

    for (const entity of entities) {
      const element = document.getElementById(getPageEntityElementId(entity.id));

      if (element)
        observer.observe(element);
    }

    return () => observer.disconnect();
  }, [entityIds, topOffset]);

  return {activeId, setActiveId};
}
