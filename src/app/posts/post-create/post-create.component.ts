import {Component, OnInit} from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;


  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: null
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
        }, (error: HttpErrorResponse) => {
           console.error('***Error received from server: ', error);
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        const tmp = { id: null, title: '', content: '', imagePath: null};
        this.post = tmp;
      }
    });
  }

  onSavePost() {

    console.log('*** onSavePost called!!!');
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    // const post: Post = {
    //   id: null,
    //   title: this.form.value.title,
    //   content: this.form.value.content
    // };

    if (this.mode === 'create') {
      console.log('*** ADD POST');
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      console.log('*** UPDATE POST');
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    console.log('*** onImagePicked() called');
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
