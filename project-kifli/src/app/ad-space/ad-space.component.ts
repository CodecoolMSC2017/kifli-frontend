import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ad-space',
  templateUrl: './ad-space.component.html',
  styleUrls: ['./ad-space.component.css']
})
export class AdSpaceComponent implements OnInit {

  @Input() product;
  pictureId: string;
  noPictureUrl: string;

  constructor() { }

  ngOnInit() {
    if (this.product.pictureIds[0]) {
      this.pictureId = this.product.pictureIds[0];
    } else {
      this.noPictureUrl = 'assets/img/vegetable.jpeg';
    }
  }

}
