interface IProps {
  data: object;
}

export default function JsonLd(props: IProps) {
  // "<" escaped so text from the database cannot close the script tag
  const json = JSON.stringify(props.data).replace(/</g, "\u003c");

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: json}}/>
  )
}
