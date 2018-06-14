import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'Post 1', content: 'post 1 content'},
  //   {title: 'Post 2', content: 'post 2 content'},
  //   {title: 'Post 3', content: 'post 3 content'},
  // ];

  posts: Post[] = [];
  private postsSub: Subscription;


  constructor(public postsService: PostsService, public router: Router) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });

  }

  ngOnDestroy() {
    // evitar memory leaks na aplicação
    this.postsSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  onEdit(postId: string) {
    this.router.navigateByUrl(`/edit/${postId}`);
  }
}
