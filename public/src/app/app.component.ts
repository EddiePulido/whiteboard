import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit{

  @ViewChild(CanvasComponent, {static:false})
  private canvasComponent : CanvasComponent;

  selectedColor = "";
  selectedSize = 20;
  bomb : any;
  title = 'public';
  constructor() {};
  
  ngAfterViewInit() {
    console.log(this.selectedColor);
  }

  update(jscolor) {
    console.log("tester", jscolor);
    this.selectedColor = jscolor;
    console.log(this.selectedColor);
  }
  microify() {
    this.selectedSize= 3;
  }
  smallify() {
    this.selectedSize = 6; 
  }

  medify() {
    this.selectedSize = 15;
  }

  bigify() {
    this.selectedSize = 40;
  }

  eraser() {
    this.selectedColor = "#FFFFFF"; 
    console.log(this.selectedColor);
  }

  draw(jscolor){
    this.selectedColor = jscolor;
  }

  

  clear() {
    this.canvasComponent.redraw();
  }

}
