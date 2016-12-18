import {
  Directive,
  Renderer,
  ElementRef,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import {DisableService} from './disable.service';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[rsbDisableElement]'
})
/**
 * Disable a Element if it is not on top of the carousel.
 */
export class DisableElementDirective implements OnDestroy, OnInit {
  private _subscrition: Subscription;


  private disableElements: string[] = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'OPTGROUP', 'OPTION', 'FIELDSET'];
  private disable;

  constructor(private el: ElementRef, private renderer: Renderer, @Optional() private disableService: DisableService) {
    this.disable = this.disableElements.indexOf(this.el.nativeElement.tagName.toUpperCase()) > -1;
  }

  ngOnInit(): void {
    if (this.disableService != null) {
      this._subscrition = this.disableService.hasBeenDisabled$.subscribe((value: boolean) => {
        if (this.disable) {
          this.setDisabled(value);
        } else {
          this.setNoSelectionClass(value);
        }
      });
    }
  }


  private setNoSelectionClass(value: boolean) {
    if (value) {
      this.renderer.setElementClass(this.el.nativeElement, 'no_select', true);
    } else {
      this.renderer.setElementClass(this.el.nativeElement, 'no_select', false);
    }
  }

  private setDisabled(value: boolean) {
    if (value) {
      this.renderer.setElementAttribute(this.el.nativeElement, 'disabled', '');
    } else {
      this.renderer.setElementAttribute(this.el.nativeElement, 'disabled', null);
    }
  }

  public ngOnDestroy(): void {
    if (this._subscrition != null) {
      this._subscrition.unsubscribe();
    }
  }
}
