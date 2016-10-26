import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'rsb-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}

@Component({
  selector: 'rsb-gallery-element',
  template: '<div class="gallery__element"><ng-content></ng-content></div>',
  styleUrls: ['./gallery.component.css']
})
export class GalleryElementComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
