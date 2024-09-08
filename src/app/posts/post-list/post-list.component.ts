import { Component, DestroyRef, OnInit, WritableSignal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { PostInterface } from '../../models/post.interface';
import { PostsService } from '../../services/posts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [MatExpansionModule, MatButton, MatProgressSpinner, MatPaginator],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit {
  posts: PostInterface[] = [];
  isLoadingPosts = true;
  totalPosts: WritableSignal<number>;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  isAuthenticated = false;
  userId!: string | null;

  constructor(
    private postsService: PostsService,
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private router: Router,
  ) {
    this.totalPosts = this.postsService.totalPostsCount;
  }

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();

    this.postsService.postsUpdate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((posts) => {
        this.posts = posts;
        this.isLoadingPosts = false;
      });
    this.authService
      .getAuthStatusListener()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  editPost(id: string) {
    this.router.navigate([`edit/${id}`]);
  }

  deletePost(id: string) {
    this.postsService
      .deletePost(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (
            this.posts?.length - (1 % this.postsPerPage) === 0 &&
            this.currentPage > 1
          ) {
            this.currentPage = this.currentPage - 1;
          }

          this.postsService.getPosts(this.postsPerPage, this.currentPage);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  paginationChanged($event: PageEvent) {
    this.currentPage = $event.pageIndex + 1;
    this.postsPerPage = $event.pageSize;
    this.postsService.getPosts($event.pageSize, $event.pageIndex + 1);
  }
}
