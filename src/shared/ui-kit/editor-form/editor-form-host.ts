"use client"

import {createContext, useCallback, useMemo, useRef, useState} from "react";
import {FormInstance} from "antd";

export interface IEditorFormHost {
  register: (form: FormInstance | null) => void;
  failedValidations: number;
}

export const EditorFormHostContext = createContext<IEditorFormHost | null>(null);

export function useEditorFormHost() {
  const formRef = useRef<FormInstance | null>(null);
  const [failedValidations, setFailedValidations] = useState<number>(0);

  const register = useCallback((form: FormInstance | null) => {
    formRef.current = form;
  }, []);

  const host = useMemo<IEditorFormHost>(() => ({register, failedValidations}), [register, failedValidations]);

  const validate = useCallback(async (): Promise<string | null> => {
    if (!formRef.current)
      return null;

    try {
      await formRef.current.validateFields();
      return null;
    }
    catch (error) {
      setFailedValidations((prevState) => prevState + 1);
      return (error as {errorFields?: {errors: string[]}[]}).errorFields?.[0]?.errors[0] ?? "";
    }
  }, []);

  return {host, validate};
}
