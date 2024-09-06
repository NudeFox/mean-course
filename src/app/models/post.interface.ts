export interface PostInterface {
  id: string;
  title: string;
  content: string;
  imagePath: string | null;
}

export interface ServerPostInterface extends Omit<PostInterface, 'id'> {
  _id: string;
}
