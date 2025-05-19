import {ComponentDescriptorType} from "@/widgets/page-component-renderer/types/type";
import {IPageComponentExample} from "@/entities/dynamic-page";
import {NewsList, NewsListComponentExample} from "./news-list";
import {HeroSectionMain, HeroSectionMainComponentExample} from "./hero-section-main";
import {MarkdownText, MarkdownTextComponentExample} from "./markdown-text";
import {Title, TitleComponentExample} from "./title";
import {ContactUs, ContactUsComponentExample} from "./contact-us";

export type PageComponentType = "title"|
  "markdown-text"|
  "hero-section-main"|
  "news-list"|
  "contact-us";

export const componentTypes: ComponentDescriptorType = {
  "title": {
    "renderComponent": (props) => <Title componentProps={props}/>,
    "renderEditor": (props, onChange) => <Title.Editor componentProps={props} onChange={onChange}/>
  },
  "markdown-text": {
    "renderComponent": (props) => <MarkdownText componentProps={props}/>,
    "renderEditor": (props, onChange) => <MarkdownText.Editor componentProps={props} onChange={onChange}/>
  },
  "hero-section-main": {
    "renderComponent": (props) => <HeroSectionMain componentProps={props}/>,
    "renderEditor": (props, onChange) => <HeroSectionMain.Editor componentProps={props} onChange={onChange}/>
  },
  "news-list": {
    "renderComponent": (props) => <NewsList componentProps={props}/>,
    "renderEditor": (props, onChange) => <NewsList.Editor componentProps={props} onChange={onChange}/>
  },
  "contact-us": {
    "renderComponent": (props) => <ContactUs componentProps={props}/>,
    "renderEditor": (props, onChange) => <ContactUs.Editor componentProps={props} onChange={onChange}/>
  },
}

export const pageComponentExamples: IPageComponentExample[] = [
  TitleComponentExample,
  MarkdownTextComponentExample,
  HeroSectionMainComponentExample,
  NewsListComponentExample,
  ContactUsComponentExample,
]