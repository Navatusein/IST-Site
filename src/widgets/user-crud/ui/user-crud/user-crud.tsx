import {IUser} from "@/entities/user";
import {App, TableColumnsType, Tag} from "antd";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {CrudComponent} from "@/widgets/crud-component";
import UserCrudForm from "../user-crud-form/user-crud-form";
import {
  addUserAction,
  removeUsersAction,
  updateUserAction,
  updateUserPasswordAction
} from "@/entities/user/actions/actions";
import PasswordModal from "@/widgets/user-crud/ui/password-modal/password-modal";
import {FormOutlined} from "@ant-design/icons";
import {useServerAction} from "@/shared/hooks/use-server-action";
import {dateStringSorter, stringSorter} from "@/shared/utilities/sorters";

interface IProps {
  users: IUser[];
}

const COLUMNS: TableColumnsType<IUser> = [
  {
    title: "Логін",
    dataIndex: "login",
    key: "login",
    width: 150,
    sorter: (a, b) => stringSorter(a.login, b.login),
    showSorterTooltip: {
      title: "Сортування за логіном"
    }
  },
  {
    title: "Імя",
    dataIndex: "name",
    key: "name",
    width: 150,
    sorter: (a, b) => stringSorter(a.name, b.name),
    showSorterTooltip: {
      title: "Сортування за іменем"
    }
  },
  {
    title: "Дозволи",
    dataIndex: "permissions",
    key: "permissions",
    width: 350,
    render: (permissions: string[]) => (
      permissions.sort().map((permission) => (
        <Tag color="blue" key={permission} style={{margin: 2}}>{permission}</Tag>
      ))
    )
  },
  {
    title: "Має пароль",
    dataIndex: "passwordHash",
    key: "passwordHash",
    width: 115,
    render: (passwordHash?: string) => (
      passwordHash != null ?
        <Tag color="green">Так</Tag> :
        <Tag color="red">Ні</Tag>
    )
  },
  {
    title: "Створено",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 115,
    render: (date: string) => (
      new Date(date).toLocaleString()
    ),
    sorter: (a, b) => dateStringSorter((a as any).createdAt, (b as any).createdAt),
    showSorterTooltip: {
      title: "Сортування за датою створення"
    }
  },
  {
    title: "Оновлено",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 115,
    render: (date: string) => (
      new Date(date).toLocaleString()
    ),
    sorter: (a, b) => dateStringSorter((a as any).updatedAt, (b as any).updatedAt),
    showSorterTooltip: {
      title: "Сортування за датою редагування"
    }
  }
];

export default function UserCrud(props: IProps) {
  const {notification} = App.useApp();

  const router = useRouter()

  const [selectedRows, setSelectedRows] = useState<IUser[]>([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState<boolean>(false);

  const create = async (data: IUser) => {
    await useServerAction(addUserAction({...data, _id: null}));
  }

  const update = async (data: IUser) => {
    await useServerAction(updateUserAction(data));
  }

  const remove = async (data: IUser[]) => {
    await useServerAction(removeUsersAction(data));
  }

  const refresh = () => {
    router.refresh();
  }

  const search = (data: IUser[], query: string): IUser[] => {
    return data.filter((x) =>
      x.login.toLowerCase().includes(query) ||
      x.name.toLowerCase().includes(query)
    );
  }

  const setPassword = async (password: string) => {
    updateUserPasswordAction(selectedRows[0]._id, password)
      .then(() => {
        notification.success({title: "Успішно оновлено пароль"});
        setSelectedRows(() => []);
        setIsPasswordModalOpen(() => false);

        setTimeout(() => {
          router.refresh();
        }, 500);
      })
      .catch((error) => {
        notification.error({title: "Помилка оновленя паролю", description: error.message});
      });
  }

  const openPasswordModal = () => {
    setIsPasswordModalOpen(() => true);
  }

  return (
    <>
      <CrudComponent<IUser>
        columns={COLUMNS}
        data={props.users}
        isLoading={false}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        create={create}
        update={update}
        remove={remove}
        refresh={refresh}
        search={search}
        additionalToolbarButtons={[
          {
            label: "Змінити пароль",
            tooltip: "Змінити пароль користувача",
            icon: <FormOutlined/>,
            onClick: () => openPasswordModal(),
            disabled: selectedRows.length != 1
          }
        ]}
        additionalDropdownMenuItems={[
          {
            key: "edit-password",
            label: "Змінити пароль",
            icon: <FormOutlined/>,
            onClick: () => openPasswordModal()
          },
        ]}
      >
        <UserCrudForm/>
      </CrudComponent>
      <PasswordModal
        isOpen={isPasswordModalOpen}
        setIsOpen={setIsPasswordModalOpen}
        username={selectedRows[0]?.name}
        setPassword={setPassword}
      />
    </>
  )
}
