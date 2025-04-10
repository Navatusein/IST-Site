"use client"

import {Avatar, Flex, Typography} from "antd";
import {useSession} from "next-auth/react";
import {useMemo} from "react";

interface IProps {
  isMenuClosed: boolean;
}

export default function UserCard(props: IProps) {
  const session = useSession()

  const userName = useMemo(() => {
    return session.data?.user?.name
  }, [session])

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
          {userName}
        </Typography.Text>
      }
    </Flex>
  );
}