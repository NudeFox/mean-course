import { Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import authRoutes from './auth/auth.routes';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
  },
  {
    path: 'create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./posts/create-post/create-post.component').then(
        (m) => m.CreatePostComponent,
      ),
  },
  {
    path: 'edit/:postId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./posts/create-post/create-post.component').then(
        (m) => m.CreatePostComponent,
      ),
  },
  ...authRoutes,
];
