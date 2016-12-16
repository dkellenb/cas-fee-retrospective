/* tslint:disable:no-unused-variable */

import {TestBed, async} from '@angular/core/testing';
import {CarouselElementDirective} from './carousel-element.directive';
import {Renderer, ElementRef, AnimationPlayer} from '@angular/core';
import {RenderDebugInfo} from '@angular/core/src/render/api';
import {AnimationStyles} from '@angular/platform-browser/src/private_import_core';
import {AnimationKeyframe} from '@angular/core/src/animation/animation_keyframe';

describe('Directive: CarouselElement', () => {
  it('should create an instance', () => {
    let directive = new CarouselElementDirective(new ElementRef({}), new StubRender(), null);
    expect(directive).toBeTruthy();
  });
});

class StubRender extends Renderer {
  selectRootElement(selectorOrNode: string|any, debugInfo?: RenderDebugInfo): any {
    return undefined;
  }

  createElement(parentElement: any, name: string, debugInfo?: RenderDebugInfo): any {
    return undefined;
  }

  createViewRoot(hostElement: any): any {
    return undefined;
  }

  createTemplateAnchor(parentElement: any, debugInfo?: RenderDebugInfo): any {
    return undefined;
  }

  createText(parentElement: any, value: string, debugInfo?: RenderDebugInfo): any {
    return undefined;
  }

  projectNodes(parentElement: any, nodes: any[]): void {
  }

  attachViewAfter(node: any, viewRootNodes: any[]): void {
  }

  detachView(viewRootNodes: any[]): void {
  }

  destroyView(hostElement: any, viewAllNodes: any[]): void {
  }

  listen(renderElement: any, name: string, callback: Function): Function {
    return undefined;
  }

  listenGlobal(target: string, name: string, callback: Function): Function {
    return undefined;
  }

  setElementProperty(renderElement: any, propertyName: string, propertyValue: any): void {
  }

  setElementAttribute(renderElement: any, attributeName: string, attributeValue: string): void {
  }

  setBindingDebugInfo(renderElement: any, propertyName: string, propertyValue: string): void {
  }

  setElementClass(renderElement: any, className: string, isAdd: boolean): void {
  }

  setElementStyle(renderElement: any, styleName: string, styleValue: string): void {
  }

  invokeElementMethod(renderElement: any, methodName: string, args?: any[]): void {
  }

  setText(renderNode: any, text: string): void {
  }

  animate(element: any, startingStyles: AnimationStyles, keyframes: AnimationKeyframe[], duration: number,
          delay: number, easing: string, previousPlayers?: AnimationPlayer[]): AnimationPlayer {
    return undefined;
  }
}
