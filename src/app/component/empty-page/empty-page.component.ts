import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empty-page.component.html',
  styleUrl: './empty-page.component.scss'
})
export class EmptyPageComponent {

}
