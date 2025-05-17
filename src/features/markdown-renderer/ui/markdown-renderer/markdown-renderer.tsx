import Markdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {Typography} from "antd";
import Link from "next/link";

interface IProps {
  content: string;
}

export default function MarkdownRenderer(props: IProps) {
  return (
    <Markdown
      rehypePlugins={[rehypeSanitize, rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => {
          const {children, className, ...rest} = props;
          return (
            <Typography.Title level={1} className={className} {...rest}>
              {children}
            </Typography.Title>
          )
        },
        h2: (props) => {
          const {children, className, ...rest} = props;
          return (
            <Typography.Title level={2} className={className} {...rest}>
              {children}
            </Typography.Title>
          )
        },
        h3: (props) => {
          const {children, className, ...rest} = props;
          return (
            <Typography.Title level={3} className={className} {...rest}>
              {children}
            </Typography.Title>
          )
        },
        h4: (props) => {
          const {children, className, ...rest} = props;
          return (
            <Typography.Title level={4} className={className} {...rest}>
              {children}
            </Typography.Title>
          )
        },
        h5: (props) => {
          const {children, className, ...rest} = props;
          return (
            <Typography.Title level={5} className={className} {...rest}>
              {children}
            </Typography.Title>
          )
        },
        p: (props) => {
          const {children, className, style, ...rest} = props;
          return (
            <Typography.Paragraph className={className} style={{...style, margin: 0}} {...rest}>
              {children}
            </Typography.Paragraph>
          )
        },
        a: (props) => {
          const {children, className, style, href, ...rest} = props;

          console.log(props)

          return (
            <Link href={href ?? "#"} className={className} style={{...style, margin: 0}}>
              {children}
            </Link>
          )
        }
      }}
    >
      {props.content}
    </Markdown>
  )
}
