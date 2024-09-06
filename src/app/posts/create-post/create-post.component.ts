import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatError, MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { PostInterface } from '../../models/post.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { mimeTypeValidator } from './mime-type.validator';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatCard,
    MatCardContent,
    MatButton,
    ReactiveFormsModule,
    MatError,
    MatIcon,
    NgOptimizedImage,
  ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss',
})
export class CreatePostComponent implements OnInit {
  private postsService = inject(PostsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  private editedPostId: string | null = null;

  postForm = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    image: new FormControl<null | File | string>(null, {
      asyncValidators: [mimeTypeValidator as AsyncValidatorFn],
    }),
  });

  imagePreview: string | null = null;

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const postId = params.get('postId');
        if (postId) {
          this.postsService.getPost(postId).subscribe({
            next: (post) => {
              this.editedPostId = post.id;
              this.postForm.patchValue({
                title: post.title,
                content: post.content,
                image: post.imagePath,
              });
              if (post.imagePath) {
                this.imagePreview = post.imagePath;
              }
            },
            error: (error) => {
              console.error(error);
            },
          });
        }
      });
  }

  filePickerChanged($event: Event) {
    const file = ($event.target as HTMLInputElement).files?.[0];
    this.postForm.patchValue({ image: file });
    this.postForm.get('image')?.updateValueAndValidity();

    if (!file) {
      this.imagePreview = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  savePost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    if (this.editedPostId) {
      this.postsService.updatePost(
        {
          ...this.postForm.value,
          id: this.editedPostId,
        } as PostInterface,
        this.postForm.value.image,
      );

      this.editedPostId = null;
    } else {
      this.postsService.addPost(
        this.postForm.value as PostInterface,
        this.postForm.value.image as File,
      );
    }

    this.postForm.reset();
    this.router.navigate(['/']);
  }
}
