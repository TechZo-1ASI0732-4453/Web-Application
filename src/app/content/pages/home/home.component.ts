import { Component } from '@angular/core';
import { FeaturePostsContentComponent } from '../../components/feature-posts-content/feature-posts-content.component';
import { LatesPostsContentComponent } from "../../components/lates-posts-content/lates-posts-content.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FeaturePostsContentComponent,
    LatesPostsContentComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
