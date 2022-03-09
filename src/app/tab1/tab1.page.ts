import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  items: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  selected: number = this.items[3];

  constructor() {
  }

  ngOnInit(): void {
    this.selected = this.items[3];
    setTimeout(() => {
      this.selected = this.items[5];
    }, 5000);
  }

  onSelectedChange(item: number): void {
    console.log(item);
  }

}
