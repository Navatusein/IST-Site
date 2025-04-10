import {DynamicPageModel, IDynamicPage} from "@/entities/dynamic-page";

interface IProps {

}

export default async function Page(props: IProps) {
  await DynamicPageModel.deleteOne({path: "test"})

  const data = {
    name: "Test",
    title: "Test",
    path: "test",
    components: [
      {type: "text", content: "# Some Text"}
    ]
  }

  console.log(DynamicPageModel.discriminators)

  const model = await DynamicPageModel.create<IDynamicPage>(data);

  console.log(model)

  return (
    <>

    </>
  );
}
