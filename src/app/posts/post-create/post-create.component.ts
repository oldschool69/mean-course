import {Component, OnInit} from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  post: Post;
  private mode = 'create';
  private postId: string;


  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.postsService.getPost(this.postId);
      } else {
        this.mode = 'create';
        this.postId = null;
        const tmp = { id: null, title: '', content: ''};
        this.post = tmp;
      }
    });
  }

  onAddPost(form: NgForm) {

    if (form.invalid) {
      return;
    }
    const post: Post = {
      id: null,
      title: form.value.title,
      content: form.value.content
    };
    this.postsService.addPost(post.title, post.content);
    form.resetForm();
  }
}
