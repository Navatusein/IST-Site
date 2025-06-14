"use client"

import {ITeacher} from "@/entities/teacher";
import {useEffect, useState} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {updateTeacherAction} from "@/entities/teacher/actions/actions";
import {DynamicPageEditor} from "@/widgets/dynamic-page-editor";

interface IProps {
  teacher: ITeacher
}

export default function AdminEditTeacherView(props: IProps) {
  const [teacher, setTeacher] = useState<ITeacher>(props.teacher);

  useEffect(() => {
    setTeacher(() => props.teacher);
  }, [props.teacher]);

  const setComponents = (components: IBasePageComponent[]) => {
    setTeacher((prevState) => (
      {...prevState, components: components} as ITeacher
    ));
  }

  const saveComponents = async () => {
    await useServerAction(updateTeacherAction(teacher));
  }

  return (
    <DynamicPageEditor
      components={teacher.components}
      setComponents={setComponents}
      saveComponents={saveComponents}
    />
  )
}
