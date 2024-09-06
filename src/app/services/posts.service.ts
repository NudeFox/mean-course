import { inject, Injectable, signal } from '@angular/core';
import { PostInterface, ServerPostInterface } from '../models/post.interface';
import { map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private http = inject(HttpClient);
  private posts: PostInterface[] = [];
  private postsUpdateSubject = new Subject<PostInterface[]>();

  postsUpdate$ = this.postsUpdateSubject.asObservable();
  totalPostsCount = signal<number>(0);

  getPosts(postsPerPage: number, currentPage: number): void {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;

    this.http
      .get<{
        message: string;
        posts: ServerPostInterface[];
        totalCount: number;
      }>(`http://localhost:3000/api/posts${queryParams}`)
      .pipe(
        map((response) => {
          return {
            posts: response.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            totalCount: response.totalCount,
          };
        }),
      )
      .subscribe({
        next: (response) => {
          this.totalPostsCount.set(response.totalCount);
          this.posts = response.posts;
          this.postsUpdateSubject.next([...this.posts]);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getPost(id: string): Observable<PostInterface> {
    return this.http
      .get<{
        message: string;
        post: ServerPostInterface;
      }>(`http://localhost:3000/api/posts/${id}`)
      .pipe(
        map((response) => {
          return {
            title: response.post.title,
            content: response.post.content,
            id: response.post._id,
            imagePath: response.post.imagePath,
          };
        }),
      );
  }

  addPost(post: PostInterface, imageFile: File | null): void {
    const postData = new FormData();

    if (imageFile) {
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', imageFile, post.title);
    }

    this.http
      .post<{
        message: string;
        post: PostInterface;
      }>('http://localhost:3000/api/posts', imageFile ? postData : post)
      .subscribe({
        next: (res) => {
          this.posts.push(post);
          this.totalPostsCount.set(this.totalPostsCount() + 1);
          this.postsUpdateSubject.next([...this.posts]);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  updatePost(
    post: PostInterface,
    image: File | string | null | undefined,
  ): void {
    let postData: PostInterface | FormData = post;

    if (!!image && typeof image === 'object') {
      postData = new FormData();
      postData.append('id', post.id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', image, post.title);
    }

    this.http
      .put(`http://localhost:3000/api/posts/${post.id}`, postData)
      .subscribe({
        next: () => {
          const postIndex = this.posts.findIndex((p) => p.id === post.id);
          this.posts[postIndex] = post;
          this.postsUpdateSubject.next([...this.posts]);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  deletePost(id: string): Observable<Object> {
    return this.http.delete(`http://localhost:3000/api/posts/${id}`);
  }
}
