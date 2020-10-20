export default class DoubleSlider {

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
    this.setDefault();
  }

  initEventListeners() {
    document.addEventListener('pointerdown', this.mouseDown);
  }

  removeListeners() {
    document.removeEventListener('pointerdown', this.mouseDown);
    document.removeEventListener('pointermove', this.mouseMove);
    document.removeEventListener('pointerup', this.mouseUp);
  }

  setDefault() {
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
    if (event.target === this.subElements.thumbLeft) {
      this.minNewPosition = this.subElements.inner.getBoundingClientRect().left;
      this.maxNewPosition = this.subElements.thumbRight.getBoundingClientRect().left;

    }
    if (event.target === this.subElements.thumbRight) {
      this.minNewPosition = this.subElements.thumbLeft.getBoundingClientRect().right;
      this.maxNewPosition = this.subElements.inner.getBoundingClientRect().right;
    }
    this.currentMovableElement = event.target;
    document.addEventListener('pointermove', this.mouseMove);
    document.addEventListener('pointerup', this.mouseUp);
  }

  mouseMove = event => {
    if (!this.currentMovableElement) {
      return;
    }
    let newPosition = event.clientX - 5;
    if (this.minNewPosition > event.clientX) {
      newPosition = this.minNewPosition;
    }
    if (event.clientX > this.maxNewPosition) {
      newPosition = this.maxNewPosition;
    }
    switch (this.currentMovableElement) {
    case this.subElements.thumbLeft:
      const leftP = (newPosition - this.minNewPosition) / this.getSliderLength * 100;
      this.subElements.progress.style.left = `${leftP}%`;
      this.subElements.thumbLeft.style.left = `${leftP}%`;
      this.subElements.from.innerHTML = this.formatValue(this.getValue().from);
      break;
    case this.subElements.thumbRight:
      const rightP = (this.maxNewPosition - newPosition) / this.getSliderLength * 100;
      this.subElements.progress.style.right = `${rightP}%`;
      this.subElements.thumbRight.style.right = `${rightP}%`;
      this.subElements.to.innerHTML = this.formatValue(this.getValue().to);
      break;
    }
  }

  mouseUp = event => {
    const customEvent = new CustomEvent('range-select', {
      detail: this.getValue(),
      bubbles: true
    });
    this.element.dispatchEvent(customEvent);
    document.removeEventListener('pointermove', this.mouseMove);
    document.removeEventListener('pointerup', this.mouseUp);
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
