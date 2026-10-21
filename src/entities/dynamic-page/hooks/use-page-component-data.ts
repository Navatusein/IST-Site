import {useEffect, useState} from "react";
import {unwrapServerAction} from "@/shared/utilities/unwrap-server-action";
import {IBasePageComponent} from "../types/type";
import {usePageComponentRegistry} from "../model/page-component-registry";

export function usePageComponentData<D>(component: IBasePageComponent, initialData?: D): D | undefined {
  const registry = usePageComponentRegistry();
  const [data, setData] = useState<D | undefined>(initialData);

  useEffect(() => {
    if (initialData !== undefined)
      return;

    const loadData = registry.getDescriptor(component.componentType)?.loadData;

    if (!loadData)
      return;

    let isCancelled = false;

    unwrapServerAction(loadData(component))
      .then((value) => {
        if (!isCancelled)
          setData(() => value as D);
      })
      .catch((error) => console.error(error));

    return () => {
      isCancelled = true;
    };
  }, [component, initialData, registry]);

  return data;
}
