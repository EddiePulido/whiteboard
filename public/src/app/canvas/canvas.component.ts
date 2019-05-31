import {
    Component, Input, ElementRef, AfterViewInit, ViewChild, OnInit
  } from '@angular/core';
  import { fromEvent } from 'rxjs';
  import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
  
  @Component({
    selector: 'app-canvas',
    template: '<canvas #canvas></canvas>',
    styles: ['canvas { border: 1px solid #000; }']
  })
  export class CanvasComponent implements AfterViewInit{
  
    @ViewChild('canvas', {static:true}) public canvas: ElementRef;
  
    @Input() public width = 1000;
    @Input() public height = 800;
    @Input() markerColor: string;
    @Input() size : number;
  
    private cx: CanvasRenderingContext2D;

    public ngAfterViewInit() {
      const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
      this.cx = canvasEl.getContext('2d');
  
      canvasEl.width = this.width;
      canvasEl.height = this.height;
  
      this.cx.lineWidth = this.size;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = "#00000"
  
      this.captureEvents(canvasEl);
    }
    
    private captureEvents(canvasEl: HTMLCanvasElement) {
      // this will capture all mousedown events from the canvas element
      fromEvent(canvasEl, 'mousedown')
        .pipe(
          switchMap((e) => {
            // after a mouse down, we'll record all mouse moves
            return fromEvent(canvasEl, 'mousemove')
              .pipe(
                // we'll stop (and unsubscribe) once the user releases the mouse
                // this will trigger a 'mouseup' event    
                takeUntil(fromEvent(canvasEl, 'mouseup')),
                // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
                takeUntil(fromEvent(canvasEl, 'mouseleave')),
                // pairwise lets us get the previous value to draw a line from
                // the previous point to the current point    
                pairwise()
              )
          })
        )
        .subscribe((res: [MouseEvent, MouseEvent]) => {
          const rect = canvasEl.getBoundingClientRect();
    
          // previous and current position with the offset
          const prevPos = {
            x: res[0].clientX - rect.left,
            y: res[0].clientY - rect.top
          };
    
          const currentPos = {
            x: res[1].clientX - rect.left,
            y: res[1].clientY - rect.top
          };
    
          // this method we'll implement soon to do the actual drawing
          this.drawOnCanvas(prevPos, currentPos);
        });
    }
  
    private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
      this.cx.strokeStyle = this.markerColor;
      this.cx.lineWidth = this.size;

      if (!this.cx) { return; }
  
      this.cx.beginPath();
  
      if (prevPos) {
        this.cx.moveTo(prevPos.x, prevPos.y); // from
        this.cx.lineTo(currentPos.x, currentPos.y);
        this.cx.stroke();
      }
    }

    public redraw() {
      console.log("Redrawing");
      this.cx.clearRect(0,0, this.width, this.height);
    }


  
  }
  