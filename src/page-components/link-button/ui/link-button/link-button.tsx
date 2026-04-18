import {useMemo} from "react";
import {IBasePageComponent} from "@/entities/dynamic-page";
import {PageComponentError} from "@/shared/ui-kit";
import LinkButtonEditor from "../link-button-editor/link-button-editor";
import {ILinkButtonPageComponent} from "../../types/type";
import {Button} from "antd";
import {useRouter} from "next/navigation";

interface IProps {
  component: IBasePageComponent;
}

export default function LinkButton(props: IProps) {
  const router = useRouter();

  const typedComponent = useMemo(() => {
    if (props.component.componentType !== "link-button")
      return null;

    return props.component as ILinkButtonPageComponent;
  }, [props]);

  const onClick = () => {
    let url = typedComponent!.link;

    if (typedComponent?.linkType == "file")
      url = `/file${url}`;

    router.push(url);
  }

  return (
    <PageComponentError component={typedComponent}>
      <Button onClick={onClick} type="primary" block>
        {typedComponent!.title}
      </Button>
    </PageComponentError>
  )
}

LinkButton.Editor = LinkButtonEditor