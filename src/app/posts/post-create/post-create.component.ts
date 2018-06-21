import {Component, OnInit} from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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
  private mode = 'create';
  private postId: string;


  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        }, (error: HttpErrorResponse) => {
           console.error('***Error received from server: ', error);
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        const tmp = { id: null, title: '', content: ''};
        this.post = tmp;
      }
    });
  }

  onSavePost(form: NgForm) {

    console.log('*** onSavePost called!!!');
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const post: Post = {
      id: null,
      title: form.value.title,
      content: form.value.content
    };

    if (this.mode === 'create') {
      console.log('*** ADD POST');
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      console.log('*** UPDATE POST');
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }

    form.resetForm();
  }
}
