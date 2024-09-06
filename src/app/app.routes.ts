import { Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';

export const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./posts/create-post/create-post.component').then(
        (m) => m.CreatePostComponent,
      ),
  },
  {
    path: 'edit/:postId',
    loadComponent: () =>
      import('./posts/create-post/create-post.component').then(
        (m) => m.CreatePostComponent,
      ),
  },
];
