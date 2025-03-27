import {Avatar, Flex, Typography} from "antd";
import {useSession} from "next-auth/react";
import {signOut} from "@/auth";

interface IProps {
  isMenuClosed: boolean;
}

export default function UserCard(props: IProps) {
  const session = useSession()

  return (
    <Flex
      style={{maxWidth: "100%", padding: !props.isMenuClosed ? "16px 0 16px 16px" : "16px 0 16px 0", overflow: "hidden", transition: "all 0.5s"}}
      align="center"
      justify={!props.isMenuClosed ? "start" : "center"}
      gap={10}
    >
      <Avatar size="default" style={{minWidth: "32px"}}>
        {session.data?.user?.name?.slice(0, 1).toUpperCase()}
      </Avatar>

      {!props.isMenuClosed &&
        <Typography.Text style={{textWrap: "nowrap"}}>
          {session.data?.user?.name}
        </Typography.Text>
      }
    </Flex>
  );
}