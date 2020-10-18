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
    this.element.addEventListener('range-select', this.rangeSelect.bind(this));
    this.element.addEventListener('mousedown', this.mouseDown.bind(this));
    this.element.addEventListener('mousemove', this.mouseMove.bind(this));
    this.element.addEventListener('mouseup', this.mouseUp.bind(this));
    document.body.appendChild(this.element);
  }

  rangeSelect(event) {
    //rangeSelect
  }
  mouseDown(event) {
    //mouseDown
  }
  mouseMove(event) {
    //mouseMove
  }
  mouseUp(event) {
    //mouseUp
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
