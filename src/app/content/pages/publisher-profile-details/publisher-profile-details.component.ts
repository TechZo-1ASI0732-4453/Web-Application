import { Component } from '@angular/core';
import {PublisherProfileComponent} from "../../components/publisher-profile/publisher-profile.component";

@Component({
  selector: 'app-publisher-profile-details',
  standalone: true,
  imports: [
    PublisherProfileComponent
  ],
  templateUrl: './publisher-profile-details.component.html',
  styleUrl: './publisher-profile-details.component.css'
})
export class PublisherProfileDetailsComponent {

}
