export interface DynamicPage {
  id: number;
  page_title: string;
  page_content: string;
}

export interface GetDynamicPageResponse {
  status: boolean;
  message: string;
  code: number;
  data: DynamicPage;
}
