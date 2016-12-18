import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'rsb-linebreak-text',
  templateUrl: './linebreak-text.component.html',
  styleUrls: ['./linebreak-text.component.css']
})
export class LinebreakTextComponent implements OnInit, OnChanges {

  @Input()
  public text: string;

  private textLines: string[] = [];

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] != null) {
      this.updateLinesText(changes['text'].currentValue);
    }
  }

  private updateLinesText(newText: string): void {
    if (newText == null) {
      this.textLines = [];
      return;
    }

    this.textLines = newText.split(/[\n\r]/g).filter((line: string) => {
      // filter empty Lines
      return line != null && line.length > 0;
    });
  }

  ngOnInit() {
  }
}
