import Rect from './rect'
import { clearPlaceholderElement, createPlaceholderElement } from './placeholder'
import { placeMark, removeMarks } from './marker'
import type { PluginOptions } from './type'

let active = false
let hoveringElement: HTMLElement | null = null
let selectedElement: HTMLElement | null
let targetElement: HTMLElement | null
let delayedDismiss = false
let delayedRef: ReturnType<typeof setTimeout> | null = null

class Spacing {
  options: PluginOptions
  constructor(options: PluginOptions) {
    const defaultOptions: PluginOptions = {
      shape: 'normal',
      px2rem: false,
      remRatio: 16,
      hotKey: 'Alt',
    }
    this.options = { ...defaultOptions, ...options }
  }

  start() {
    if (!document.body) {
      console.warn('Unable to initialise, document.body does not exist.')
      return
    }

    window.addEventListener('keydown', this.keyDownHandler)
    window.addEventListener('keyup', this.keyUpHandler)
    window.addEventListener('mousemove', this.cursorMovedHandler)
  }

  stop() {
    window.removeEventListener('keydown', this.keyDownHandler)
    window.removeEventListener('keyup', this.keyUpHandler)
    window.removeEventListener('mousemove', this.cursorMovedHandler)
  }

  private formate(value: number) {
    const { px2rem, remRatio } = this.options
    const suffix = px2rem ? 'rem' : 'px'
    const ratio = Math.abs(remRatio) || 16
    const targetValue = px2rem ? (value / ratio).toFixed(4) : value
    return `${targetValue}${suffix}`
  }

  private keyDownHandler(e: KeyboardEvent) {
    if (delayedDismiss) {
      this.cleanUp()
      if (delayedRef) {
        clearTimeout(delayedRef)
        delayedRef = null
      }
    }

    if (e.key === this.options.hotKey && !active) {
      e.preventDefault()
      active = true

      this.setSelectedElement()
      this.preventPageScroll(true)
    }

    if (e.shiftKey)
      delayedDismiss = true
  }

  private keyUpHandler(e: KeyboardEvent) {
    if (e.key === this.options.hotKey && active) {
      active = false

      delayedRef = setTimeout(
        () => {
          this.cleanUp()
        },
        delayedDismiss ? 3000 : 0,
      )
    }
  }

  private cleanUp(): void {
    clearPlaceholderElement('selected')
    clearPlaceholderElement('target')

    delayedDismiss = false

    selectedElement = null
    targetElement = null

    removeMarks()

    this.preventPageScroll(false)
  }

  private cursorMovedHandler(e: MouseEvent) {
    if (e.composedPath) {
      // Use composedPath to detect the hovering element for supporting shadow DOM
      hoveringElement = e.composedPath()[0] as HTMLElement
    }
    else {
      // Fallback if not support composedPath
      hoveringElement = e.target as HTMLElement
    }
    if (!active)
      return

    this.setTargetElement().then(() => {
      if (selectedElement != null && targetElement != null) {
        // Do the calculation
        const selectedElementRect: DOMRect
          = selectedElement.getBoundingClientRect()
        const targetElementRect: DOMRect = targetElement.getBoundingClientRect()

        const selected: Rect = new Rect(selectedElementRect)
        const target: Rect = new Rect(targetElementRect)

        removeMarks()

        let top: number,
          bottom: number,
          left: number,
          right: number,
          outside: boolean

        if (
          selected.containing(target)
          || selected.inside(target)
          || selected.colliding(target)
        ) {
          top = Math.round(
            Math.abs(selectedElementRect.top - targetElementRect.top),
          )
          bottom = Math.round(
            Math.abs(selectedElementRect.bottom - targetElementRect.bottom),
          )
          left = Math.round(
            Math.abs(selectedElementRect.left - targetElementRect.left),
          )
          right = Math.round(
            Math.abs(selectedElementRect.right - targetElementRect.right),
          )
          outside = false
        }
        else {
          top = Math.round(
            Math.abs(selectedElementRect.top - targetElementRect.bottom),
          )
          bottom = Math.round(
            Math.abs(selectedElementRect.bottom - targetElementRect.top),
          )
          left = Math.round(
            Math.abs(selectedElementRect.left - targetElementRect.right),
          )
          right = Math.round(
            Math.abs(selectedElementRect.right - targetElementRect.left),
          )
          outside = true
        }

        placeMark(selected, target, 'top', this.formate(top), outside)
        placeMark(selected, target, 'bottom', this.formate(bottom), outside)
        placeMark(selected, target, 'left', this.formate(left), outside)
        placeMark(selected, target, 'right', this.formate(right), outside)
      }
    })
  }

  private setSelectedElement(): void {
    if (hoveringElement && hoveringElement !== selectedElement) {
      selectedElement = hoveringElement
      clearPlaceholderElement('selected')

      const rect = selectedElement.getBoundingClientRect()

      createPlaceholderElement(
        'selected',
        rect.width,
        rect.height,
        rect.top,
        rect.left,
        'red',
      )
    }
  }

  private setTargetElement(): Promise<void> {
    return new Promise((resolve) => {
      if (
        active
        && hoveringElement
        && hoveringElement !== selectedElement
        && hoveringElement !== targetElement
      ) {
        targetElement = hoveringElement

        clearPlaceholderElement('target')

        const rect = targetElement.getBoundingClientRect()

        createPlaceholderElement(
          'target',
          rect.width,
          rect.height,
          rect.top,
          rect.left,
          'blue',
        )
        resolve()
      }
    })
  }

  private preventPageScroll(active: boolean): void {
    if (active) {
      window.addEventListener('DOMMouseScroll', this.scrollingPreventDefault, false)
      window.addEventListener('wheel', this.scrollingPreventDefault, {
        passive: false,
      })
      window.addEventListener('mousewheel', this.scrollingPreventDefault, {
        passive: false,
      })
    }
    else {
      window.removeEventListener('DOMMouseScroll', this.scrollingPreventDefault)
      window.removeEventListener('wheel', this.scrollingPreventDefault)
      window.removeEventListener('mousewheel', this.scrollingPreventDefault)
    }
  }

  private scrollingPreventDefault(e: Event): void {
    e.preventDefault()
  }
}

export default Spacing
