import type { IPostData } from "@/types";

export interface IBlogCardProps {
  title: string;
  body: string;
  search?: string;
  id: number;
  changePage: (val: number) => void;
  fetchedItems: IPostData[] | null;
}
