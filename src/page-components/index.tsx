import {ComponentDescriptorType} from "@/widgets/page-component-renderer/types/type";
import {PageComponentText} from "./page-component-text";
import {PageComponentHeroSection} from "./page-component-hero-section";
import {PageComponentNewsList} from "./page-component-news-list";

export const componentTypes: ComponentDescriptorType = {
  "text": {
    "renderComponent": (props) => <PageComponentText componentProps={props}/>,
    "renderEditor": (props, onChange) => <PageComponentText.Editor componentProps={props} onChange={onChange}/>
  },
  "hero-section": {
    "renderComponent": (props) => <PageComponentHeroSection componentProps={props}/>,
    "renderEditor": (props, onChange) => <PageComponentHeroSection.Editor componentProps={props} onChange={onChange}/>
  },
  "news-list": {
    "renderComponent": (props) => <PageComponentNewsList componentProps={props}/>,
    "renderEditor": (props, onChange) => <PageComponentNewsList.Editor componentProps={props} onChange={onChange}/>
  },
  "title": {
    "renderComponent": (props) => <PageComponentNewsList componentProps={props}/>,
    "renderEditor": (props, onChange) => <PageComponentNewsList.Editor componentProps={props} onChange={onChange}/>
  }
}