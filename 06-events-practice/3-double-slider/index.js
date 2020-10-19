export default class DoubleSlider {

  constructor({
    minValue = '$10',
    maxValue = '$100',
    left = 0,
    right = 0
  } = {}) {
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.left = left;
    this.right = right;
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate;
    this.element = element.firstElementChild;
    document.body.appendChild(this.element);
    this.leftSlider = this.element.querySelector('.range-slider__thumb-left');
    this.rightSlider = this.element.querySelector('.range-slider__thumb-right');
    this.progress = this.element.querySelector('.range-slider__progress');
    this.recalcPositions();
    this.addEventListener();
  }

  addEventListener() {
    this.element.addEventListener('range-select', this.rangeSelect.bind(this));
    window.addEventListener('resize', this.recalcPositions.bind(this));

    this.element.addEventListener('mousedown', this.mouseDown.bind(this));
    this.element.addEventListener('mousemove', this.mouseMove.bind(this));
    this.element.addEventListener('mouseup', this.mouseUp.bind(this));
  }

  recalcPositions(event) {
    this.minPosition = this.progress.getBoundingClientRect().left;
    this.maxPosition = this.progress.getBoundingClientRect().right;

    this.leftSliderPosition = this.minPosition + this.getSliderLength * this.left / 100;
    this.rightSliderPosition = this.maxPosition - this.getSliderLength * this.right / 100;
  }

  rangeSelect(event) {
    //rangeSelect
  }

  get getSliderLength() {
    return this.maxPosition - this.minPosition;
  }

  mouseDown(event) {
    if (event.target === this.leftSlider) {
      this.minNewPosition = this.minPosition;
      this.maxNewPosition = this.rightSliderPosition;
      this.currentMovableElement = event.target;
    }
    if (event.target === this.rightSlider) {
      this.minNewPosition = this.leftSliderPosition;
      this.maxNewPosition = this.maxPosition;
      this.currentMovableElement = event.target;
    }
  }

  mouseMove(event) {
    if (!this.currentMovableElement) {
      return;
    }
    this.newPosition = null;

    if (event.offsetX - this.minPosition) {

    }
    if (this.minNewPosition < event.offsetX && event.offsetX < this.maxNewPosition) {
      switch (this.currentMovableElement) {
      case this.leftSlider:
        console.log(event.offsetX + this.minPosition, this.getSliderLength);
        this.currentMovableElement.style.left = ((event.offsetX + this.minPosition) / this.getSliderLength * 100 - 100) + '%';
        break;
      case this.rightSlider:
        this.currentMovableElement.style.right = (event.offsetX / this.maxPosition * 100) + '%';
        break;
      }
    }
  }

  mouseUp(event) {
    this.currentMovableElement = null;
  }

  get getTemplate() {
    return `
    <div class="range-slider">
      <span>${this.minValue}</span>
      <div class="range-slider__inner">
        <span class="range-slider__progress" style="left: ${this.left}%; right: ${this.right}%"></span>
        <span class="range-slider__thumb-left" style="left: ${this.left}%"></span>
        <span class="range-slider__thumb-right" style="right: ${this.right}%"></span>
      </div>
      <span>${this.maxValue}</span>
    </div>
    `;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
