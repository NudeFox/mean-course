export interface PostInterface {
  id: string;
  title: string;
  content: string;
  imagePath: string | null;
  creator: string;
}

export interface ServerPostInterface extends Omit<PostInterface, 'id'> {
  _id: string;
}
