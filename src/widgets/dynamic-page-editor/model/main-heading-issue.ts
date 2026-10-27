import type {IPageMainHeading} from "@/entities/dynamic-page/model";

export interface IPageMainHeadingSource {
  text: string;
  // News and staff profiles show their own h1
  isShownByPage: boolean;
}

export type MainHeadingIssue =
  | {type: "missing"}
  | {type: "several", headings: IPageMainHeading[]}
  | {type: "extra", headings: IPageMainHeading[]};

export function getMainHeadingIssue(headings: IPageMainHeading[], source: IPageMainHeadingSource): MainHeadingIssue | null {
  if (source.isShownByPage)
    return headings.length == 0 ? null : {type: "extra", headings};

  if (headings.length == 0)
    return {type: "missing"};

  return headings.length == 1 ? null : {type: "several", headings};
}

export function getMainHeadingIssueTitle(issue: MainHeadingIssue, source: IPageMainHeadingSource): string {
  switch (issue.type) {
    case "missing":
      return "На сторінці немає заголовка 1 рівня";
    case "several":
      return `На сторінці ${issue.headings.length} ${issue.headings.length < 5 ? "заголовки" : "заголовків"} 1 рівня, а має бути один`;
    case "extra":
      return `Сторінка вже показує заголовок 1 рівня «${source.text}», а в блоках є ще ${issue.headings.length == 1 ? "один" : issue.headings.length}`;
  }
}

export function getMainHeadingIssueHint(issue: MainHeadingIssue, source: IPageMainHeadingSource): string {
  switch (issue.type) {
    case "missing":
      return `Для пошукових систем буде додано прихований заголовок «${source.text}», на вигляд сторінки це не вплине`;
    case "several":
      return "Залиште один, інші зробіть 2 рівня";
    case "extra":
      return "Зробіть їх заголовками 2 рівня";
  }
}
