export default class DoubleSlider {
  subElements = {};
  constructor({
    min = 100,
    max = 200,
    formatValue = value => '$' + value,
    selected = {
      from: min,
      to: max
    }
  } = {}) {
    this.min = min;
    this.max = max;
    this.range = max - min;
    this.formatValue = formatValue;
    this.selected = selected;
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
    document.body.appendChild(this.element);
    this.initEventListeners();
    this.update();
  }

  initEventListeners() {
    document.addEventListener('pointerdown', this.mouseDown);
  }

  removeListeners() {
    document.removeEventListener('pointerdown', this.mouseDown);
    document.removeEventListener('pointermove', this.mouseMove);
    document.removeEventListener('pointerup', this.mouseUp);
  }

  update() {
    const left = Math.floor((this.selected.from - this.min) / this.range * 100) + '%';
    const right = Math.floor((this.max - this.selected.to) / this.range * 100) + '%';

    this.subElements.progress.style.left = left;
    this.subElements.progress.style.right = right;

    this.subElements.thumbLeft.style.left = left;
    this.subElements.thumbRight.style.right = right;
  }

  get getSliderLength() {
    return this.subElements.inner.getBoundingClientRect().width;
  }

  mouseDown = event => {
    const thumbElem = event.target;

    event.preventDefault();

    const { left, right } = thumbElem.getBoundingClientRect();

    if (thumbElem === this.subElements.thumbLeft) {
      this.shiftX = right - event.clientX;
    } else {
      this.shiftX = left - event.clientX;
    }

    this.dragging = thumbElem;
    document.addEventListener('pointermove', this.mouseMove);
    document.addEventListener('pointerup', this.mouseUp);
  }

  mouseMove = event => {
    const thumbElem = event.target;
    event.preventDefault();

    const { left: innerLeft, right: innerRight, width } = this.subElements.inner.getBoundingClientRect();
    if (this.dragging === this.subElements.thumbLeft) {
      let newLeft = (event.clientX - innerLeft + this.shiftX) / width;

      if (newLeft < 0) {
        newLeft = 0;
      }
      newLeft *= 100;
      let right = parseFloat(this.subElements.thumbRight.style.right);

      if (newLeft + right > 100) {
        newLeft = 100 - right;
      }

      this.dragging.style.left = this.subElements.progress.style.left = newLeft + '%';
      this.subElements.from.innerHTML = this.formatValue(this.getValue().from);
    }

    if (this.dragging === this.subElements.thumbRight) {
      let newRight = (innerRight - event.clientX - this.shiftX) / width;

      if (newRight < 0) {
        newRight = 0;
      }
      newRight *= 100;

      let left = parseFloat(this.subElements.thumbLeft.style.left);

      if (left + newRight > 100) {
        newRight = 100 - left;
      }
      this.dragging.style.right = this.subElements.progress.style.right = newRight + '%';
      this.subElements.to.innerHTML = this.formatValue(this.getValue().to);
    }
  }

  mouseUp = event => {
    document.removeEventListener('pointermove', this.mouseMove);
    document.removeEventListener('pointerup', this.mouseUp);

    const customEvent = new CustomEvent('range-select', {
      detail: this.getValue(),
      bubbles: true
    });
    this.element.dispatchEvent(customEvent);
  }

  get getTemplate() {
    return `
    <div class="range-slider">
      <span data-element="from">${this.formatValue(this.selected.from)}</span>
      <div data-element="inner" class="range-slider__inner">
        <span data-element="progress" class="range-slider__progress" style="left: ${this.left}%; right: ${this.right}%"></span>
        <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${this.left}%"></span>
        <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${this.right}%"></span>
      </div>
      <span data-element="to">${this.formatValue(this.selected.to)}</span>
    </div>
    `;
  }

  getValue() {
    const { left } = this.subElements.thumbLeft.style;
    const { right } = this.subElements.thumbRight.style;

    const from = Math.round(this.min + parseFloat(left) * 0.01 * this.range);
    const to = Math.round(this.max - parseFloat(right) * 0.01 * this.range);

    return { from, to };
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.removeListeners();
  }
}
