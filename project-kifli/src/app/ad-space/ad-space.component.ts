import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ad-space',
  templateUrl: './ad-space.component.html',
  styleUrls: ['./ad-space.component.css']
})
export class AdSpaceComponent implements OnInit {

  @Input() product;

  constructor() { }

  ngOnInit() {
  }

}
