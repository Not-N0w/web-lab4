import { AfterViewInit, Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { CoordinatePlateService } from '../../services/CoordinatePlateService';
import { Hit } from '../../models/hit';

@Component({
  selector: 'app-coordinate-plate',
  imports: [],
  templateUrl: './coordinate-plate.html',
  styleUrls: ['./coordinate-plate.scss']
})
export class CoordinatePlate implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tooltip', { static: false }) tooltipRef!: ElementRef<HTMLDivElement>;


  private coordiatePlateService = inject(CoordinatePlateService);
  private renderer = inject(Renderer2);

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private color_fill = "rgba(52, 211, 153, 0.1)";
  private color_bright = "#34d399";
  private color_light = "#f5f5f5";

  private imagePartRatio = 0.7;
  private letterHeight = 15;
  private hatchLength = 10;

  private globalR = 1;
  private globalX !: number | null;
  private globalY !: number | null;
  private hits: Hit[] | null = null;

  private localR!: number;
  private canvasHeight!: number;
  private canvasWidth!: number;


  ngAfterViewInit() {

    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext("2d")!;

    this.coordiatePlateService.getValue().subscribe(v => {
      this.globalX = v.x;
      this.globalY = v.y;
      this.globalR = v.r;
      this.fillCanvas();
    });
    this.coordiatePlateService.getHits().subscribe(hits => {
      this.hits = hits;
      this.fillCanvas();
    });

    this.resizeCanvas();
    this.fillCanvas();

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.fillCanvas();
    });
  }


  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.round(cssWidth * dpr);
    const displayHeight = Math.round(cssHeight * dpr);

    if (this.globalR == 0) this.localR = (this.canvas.clientWidth / 2 * this.imagePartRatio);
    else this.localR = (this.globalR < 0 ? -1 : 1) * (this.canvas.clientWidth / 2 * this.imagePartRatio);

    if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(dpr, dpr);

      this.canvasWidth = this.canvas.clientWidth;
      this.canvasHeight = this.canvas.clientHeight;
    }
  }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  updateRadiusAxisText() {
    const r = (this.globalR == 0 ? 1 : this.globalR);
    const isSet = (r != null);

    const rHalf = isSet ? (r / 2).toString() : "R/2";
    const rFull = isSet ? r.toString() : "R";
    const rNegHalf = isSet ? (-r / 2).toString() : "-R/2";
    const rNegFull = isSet ? (-r).toString() : "-R";

    this.ctx.fillText(rHalf, this.canvasWidth / 2 + this.localR / 2 - this.ctx.measureText(rHalf).width / 2, this.canvasHeight / 2 + this.hatchLength / 2 + this.letterHeight);
    this.ctx.fillText(rFull, this.canvasWidth / 2 + this.localR - this.ctx.measureText(rFull).width / 2, this.canvasHeight / 2 + this.hatchLength / 2 + this.letterHeight);
    this.ctx.fillText(rNegHalf, this.canvasWidth / 2 - this.localR / 2 - this.ctx.measureText(rNegHalf).width / 2, this.canvasHeight / 2 + this.hatchLength / 2 + this.letterHeight);
    this.ctx.fillText(rNegFull, this.canvasWidth / 2 - this.localR - this.ctx.measureText(rNegFull).width / 2, this.canvasHeight / 2 + this.hatchLength / 2 + this.letterHeight);

    this.ctx.fillText(rHalf, this.canvasWidth / 2 - this.hatchLength / 2 - this.ctx.measureText(rHalf).width - 4, this.canvasHeight / 2 - this.localR / 2 + this.letterHeight / 2 - 2);
    this.ctx.fillText(rNegHalf, this.canvasWidth / 2 - this.hatchLength / 2 - this.ctx.measureText(rNegHalf).width - 4, this.canvasHeight / 2 + this.localR / 2 + this.letterHeight / 2 - 2);
    this.ctx.fillText(rFull, this.canvasWidth / 2 - this.hatchLength / 2 - this.ctx.measureText(rFull).width - 4, this.canvasHeight / 2 - this.localR + this.letterHeight / 2 - 2);
    this.ctx.fillText(rNegFull, this.canvasWidth / 2 - this.hatchLength / 2 - this.ctx.measureText(rNegFull).width - 4, this.canvasHeight / 2 + this.localR + this.letterHeight / 2 - 2);
  }


  drawAxis() {
    this.ctx.strokeStyle = this.color_light;
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = this.color_light;
    this.ctx.font = `${this.letterHeight}px "Courier New", Courier, monospace`;

    this.ctx.beginPath();
    this.drawLine(0, this.canvasHeight / 2, this.canvasWidth, this.canvasHeight / 2);
    this.drawLine(this.canvasWidth / 2 + this.localR / 2, this.canvasHeight / 2 - this.hatchLength / 2, this.canvasWidth / 2 + this.localR / 2, this.canvasHeight / 2 + this.hatchLength / 2);
    this.drawLine(this.canvasWidth / 2 + this.localR, this.canvasHeight / 2 - this.hatchLength / 2, this.canvasWidth / 2 + this.localR, this.canvasHeight / 2 + this.hatchLength / 2);
    this.drawLine(this.canvasWidth / 2 - this.localR / 2, this.canvasHeight / 2 - this.hatchLength / 2, this.canvasWidth / 2 - this.localR / 2, this.canvasHeight / 2 + this.hatchLength / 2);
    this.drawLine(this.canvasWidth / 2 - this.localR, this.canvasHeight / 2 - this.hatchLength / 2, this.canvasWidth / 2 - this.localR, this.canvasHeight / 2 + this.hatchLength / 2);

    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth - this.hatchLength, this.canvasHeight / 2 - this.hatchLength / 2);
    this.ctx.lineTo(this.canvasWidth, this.canvasHeight / 2);
    this.ctx.lineTo(this.canvasWidth - this.hatchLength, this.canvasHeight / 2 + this.hatchLength / 2);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillText("X", this.canvasWidth - this.ctx.measureText("X").width - 5, this.canvasHeight / 2 + this.hatchLength / 2 + this.letterHeight);

    this.drawLine(this.canvasWidth / 2, 0, this.canvasWidth / 2, this.canvasHeight);
    this.drawLine(this.canvasWidth / 2 - this.hatchLength / 2, this.canvasHeight / 2 - this.localR / 2, this.canvasWidth / 2 + this.hatchLength / 2, this.canvasHeight / 2 - this.localR / 2);
    this.drawLine(this.canvasWidth / 2 - this.hatchLength / 2, this.canvasHeight / 2 + this.localR / 2, this.canvasWidth / 2 + this.hatchLength / 2, this.canvasHeight / 2 + this.localR / 2);
    this.drawLine(this.canvasWidth / 2 - this.hatchLength / 2, this.canvasHeight / 2 - this.localR, this.canvasWidth / 2 + this.hatchLength / 2, this.canvasHeight / 2 - this.localR);
    this.drawLine(this.canvasWidth / 2 - this.hatchLength / 2, this.canvasHeight / 2 + this.localR, this.canvasWidth / 2 + this.hatchLength / 2, this.canvasHeight / 2 + this.localR);

    this.updateRadiusAxisText();

    this.ctx.beginPath();
    this.ctx.moveTo(this.canvasWidth / 2 - this.hatchLength / 2, this.hatchLength);
    this.ctx.lineTo(this.canvasWidth / 2, 0);
    this.ctx.lineTo(this.canvasWidth / 2 + this.hatchLength / 2, this.hatchLength);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillText("Y", this.canvasWidth / 2 - this.ctx.measureText("Y").width / 2 - this.hatchLength / 2 - 10, this.letterHeight + 2);
    this.ctx.closePath();
  }

  drawHitPoint() {
    const r = (this.globalR == 0 ? 1 : this.globalR);
    if (this.globalX == null || this.globalY == null || r == null) return;
    const y = this.canvasHeight / 2 - (this.localR / r * this.globalY);
    const x = (this.localR / r * this.globalX) + this.canvasWidth / 2;

    this.ctx.strokeStyle = '#1880ff';
    this.ctx.lineWidth = 3;
    const size = 10;

    this.ctx.beginPath();
    this.drawLine(x - size / 2, y, x + size / 2, y)
    this.drawLine(x, y - size / 2, x, y + size / 2)
    this.ctx.closePath();
  }


  drawFigure() {
    const cx = this.canvasWidth / 2;
    const cy = this.canvasHeight / 2;
    const r = this.localR;
    const negSector = (r < 0 ? Math.PI : 0);

    if (this.globalR == 0) {
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color_bright;
      this.ctx.fill();
      return;
    }


    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - r);
    this.ctx.lineTo(cx - r, cy - r);
    this.ctx.lineTo(cx - r, cy);
    this.ctx.arc(cx, cy, Math.abs(r), Math.PI - negSector, 0.5 * Math.PI + negSector, true);

    this.ctx.lineTo(cx, cy);
    this.ctx.lineTo(cx + r, cy);
    this.ctx.lineTo(cx, cy + r);
    this.ctx.lineTo(cx, cy);
    this.ctx.closePath();

    this.ctx.fillStyle = this.color_fill;
    this.ctx.fill();

    const inset = 1;
    this.ctx.beginPath();

    this.ctx.moveTo(cx - inset, cy - r + inset);
    this.ctx.lineTo(cx - r + inset, cy - r + inset);
    this.ctx.lineTo(cx - r + inset, cy);
    this.ctx.arc(cx, cy, Math.abs(r) - inset, Math.PI - negSector, 0.5 * Math.PI + negSector, true);
    this.ctx.lineTo(cx + r - inset, cy + inset);
    this.ctx.lineTo(cx - inset, cy + inset);

    this.ctx.closePath();

    this.ctx.strokeStyle = this.color_bright;
    this.ctx.lineWidth = inset * 2;
    this.ctx.stroke();
  }


  drawHistory() {
    if (!this.hits || this.hits.length === 0) return;

    for (let i = 0; i < this.hits.length; i++) {
      if (Number(this.hits[i].r) !== this.globalR) continue;

      const y = this.canvasHeight / 2 - (this.localR / this.globalR * Number(this.hits[i].y));
      const x = (this.localR / this.globalR * Number(this.hits[i].x)) + this.canvasWidth / 2;

      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = this.hits[i].hit ? "#3ece4aff" : "#f57138ff";
      this.ctx.fill();
    }
  }


  fillCanvas() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.resizeCanvas();
    this.drawFigure();
    this.drawAxis();
    this.drawHistory();
    this.drawHitPoint();
  }

  onCanvasClick(event: MouseEvent) {
    if (this.globalR == null) {
      console.warn("R is not set");
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - this.canvasWidth / 2) * (this.globalR / this.localR);
    const y = (this.canvasHeight / 2 - (event.clientY - rect.top)) * (this.globalR / this.localR);

    this.coordiatePlateService.sendPoint(x, y, this.globalR);

    this.fillCanvas();
  }

  showToolTip(event: MouseEvent) {
    const canvasEl = this.canvasRef.nativeElement;
    const tooltipEl = this.tooltipRef.nativeElement;
    const rect = canvasEl.getBoundingClientRect();

    const x = (event.clientX - rect.left - this.canvasWidth / 2) * (this.globalR / this.localR);
    const y = (this.canvasHeight / 2 - (event.clientY - rect.top)) * (this.globalR / this.localR);

    const roundedX = Math.round(x * 100000) / 100000;
    const roundedY = Math.round(y * 100000) / 100000;

    this.renderer.removeClass(tooltipEl, 'hidden');
    tooltipEl.style.whiteSpace = 'pre';

    const xText = roundedX.toString().padEnd(8, ' ');
    const yText = roundedY.toString().padEnd(8, ' ');

    tooltipEl.textContent = `X: ${xText} Y: ${yText}`;

    tooltipEl.style.left = `${event.pageX + 10}px`;
    tooltipEl.style.top = `${event.pageY}px`;
  }
  hideTooltip() {
    this.renderer.addClass(this.tooltipRef.nativeElement, 'hidden');
  }
}
