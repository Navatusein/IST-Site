"use client"

import {theme} from "antd";
import {diffWords} from "@/shared/utilities/word-diff";

interface IProps {
  before: string;
  after: string;
}

export default function DiffText(props: IProps) {
  const {token} = theme.useToken();

  const parts = diffWords(props.before, props.after);

  if (parts.length == 0)
    return <span style={{color: token.colorTextTertiary}}>—</span>;

  return (
    <span style={{whiteSpace: "pre-wrap", overflowWrap: "anywhere"}}>
      {parts.map((part, index) => part.type == "same" ? <span key={index}>{part.value}</span> : (
        <span
          key={index}
          style={{
            borderRadius: 3,
            padding: "0 1px",
            ...(part.type == "added" ?
              {background: token.colorSuccessBg, color: token.colorSuccessText} :
              {background: token.colorErrorBg, color: token.colorErrorText, textDecoration: "line-through"})
          }}
        >
          {part.value}
        </span>
      ))}
    </span>
  )
}
