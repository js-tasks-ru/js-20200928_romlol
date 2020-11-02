class Tooltip {
  shift = 20;
  initialize() {
    document.addEventListener('pointerover', this.tooltipPointerover.bind(this));
  }

  tooltipPointerover(event) {
    if (event.target.dataset.tooltip !== undefined) {
      this.text = event.target.dataset.tooltip;
      this.render();
      document.addEventListener('mousemove', this.tooltipMouseMove.bind(this));
      document.addEventListener('pointerout', this.tooltipPointerout.bind(this));
    }
  }

  tooltipPointerout(event) {
    if (event.target.dataset.tooltip !== undefined) {
      this.destroy();
    }
  }

  tooltipMouseMove(event) {
    if (this.element) {
      this.element.style.left = event.offsetX + this.shift + 'px';
      this.element.style.top = event.offsetY + this.shift + 'px';
    }
  }

  get getTemplate() {
    return `<div class="tooltip">${this.text}</div>`;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate;
    this.element = element.firstElementChild;
    document.body.appendChild(this.element);
  }

  remove() {
    this.element.remove();
    document.removeEventListener('pointerover', this.tooltipPointerover.bind(this));
    document.removeEventListener('pointerout', this.tooltipPointerout.bind(this));
    document.removeEventListener('mousemove', this.tooltipMouseMove.bind(this));
  }

  destroy() {
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
