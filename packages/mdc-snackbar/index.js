/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import {MDCComponent} from '@material/base/index';
import MDCSnackbarFoundation from './foundation';
import {announce} from './util';
import {getCorrectEventName} from '@material/animation/index';
import * as ponyfill from '@material/dom/ponyfill';

export {MDCSnackbarFoundation};

export class MDCSnackbar extends MDCComponent {
  static attachTo(root) {
    return new MDCSnackbar(root);
  }

  show() {
    this.foundation_.show();
  }

  hide() {
    this.foundation_.hide();
  }

  getDefaultFoundation() {
    const {CONTAINER_SELECTOR, LABEL_SELECTOR, ACTION_BUTTON_SELECTOR} = MDCSnackbarFoundation.strings;
    const transitionEndEventName = getCorrectEventName(window, 'transitionend');
    const getContainerEl = () => this.root_.querySelector(CONTAINER_SELECTOR);

    /* eslint brace-style: "off" */
    return new MDCSnackbarFoundation({
      announce: () => announce(this.root_, this.root_.querySelector(LABEL_SELECTOR)),
      hasClass: (className) => this.root_.classList.contains(className),
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      isActionButton: (evt) => Boolean(ponyfill.closest(evt.target, ACTION_BUTTON_SELECTOR)),
      setAriaHidden: () => this.root_.setAttribute('aria-hidden', 'true'),
      unsetAriaHidden: () => this.root_.removeAttribute('aria-hidden'),
      registerSurfaceClickHandler: (handler) => getContainerEl().addEventListener('click', handler),
      deregisterSurfaceClickHandler: (handler) => getContainerEl().removeEventListener('click', handler),
      registerKeyDownHandler: (handler) => document.addEventListener('keydown', handler),
      deregisterKeyDownHandler: (handler) => document.removeEventListener('keydown', handler),
      registerTransitionEndHandler: (handler) => this.root_.addEventListener(transitionEndEventName, handler),
      deregisterTransitionEndHandler: (handler) => this.root_.removeEventListener(transitionEndEventName, handler),
      notifyAction: () => this.emit(MDCSnackbarFoundation.strings.ACTION_EVENT),
      notifyOpening: () => this.emit(MDCSnackbarFoundation.strings.OPENING_EVENT),
      notifyOpened: () => this.emit(MDCSnackbarFoundation.strings.OPENED_EVENT),
      notifyClosing: (reason) => this.emit(MDCSnackbarFoundation.strings.CLOSING_EVENT, {reason}),
      notifyClosed: (reason) => this.emit(MDCSnackbarFoundation.strings.CLOSED_EVENT, {reason}),
    });
  }
}
