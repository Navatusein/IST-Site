"use client"

import {
  FacebookFilled,
  GlobalOutlined,
  InstagramFilled,
  LinkedinFilled,
  SendOutlined,
  XOutlined,
  YoutubeFilled
} from "@ant-design/icons";
import {SocialNetwork} from "../../types/type";

const ICONS: Record<SocialNetwork, typeof FacebookFilled> = {
  facebook: FacebookFilled,
  instagram: InstagramFilled,
  youtube: YoutubeFilled,
  telegram: SendOutlined,
  linkedin: LinkedinFilled,
  x: XOutlined,
  other: GlobalOutlined,
};

export default function SocialNetworkIcon(props: {network: SocialNetwork}) {
  const IconComponent = ICONS[props.network] ?? GlobalOutlined;
  return <IconComponent/>;
}
