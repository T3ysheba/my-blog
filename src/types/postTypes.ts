export interface IPostData {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface IPostBody {
  userId: number;
  title: string;
  body: string;
}

export interface IPostEditBody {
  id: number;
  title: string;
  body: string;
}
