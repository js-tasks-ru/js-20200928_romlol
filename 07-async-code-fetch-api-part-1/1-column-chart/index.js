import Fetch from './utils/fetch-json.js';
import escapeHtml from './utils/escape-html.js';
export default class ColumnChart {

  static chartHeight = 50;

  constructor ({
    url = '',
    range = {
      from: Date.now(),
      to: Date.now()
    },
    value = '',
    label = '',
    link = ''
  } = {}) {
    this.url = url;
    this.label = label;
    this.value = value;
    this.link = link;
    this.calcValues = [];
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
    document.body.appendChild(this.element);
    if (this.url) {
      this.loadData();
    }
  }

  get getLink() {
    if (this.link !== '') {
      return `
        <a href="${this.link}" class="column-chart__link">View all</a>
      `;
    } else {
      return ``;
    }
  }

  get getTemplate() {
    return `
      <div class="column-chart column-chart_loading">
        <div class="column-chart__title">
        Total ${this.label}
        ${this.getLink}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.calcValues.map(value => this.getChartColumn(value)).join('')}
        </div>
      </div>
    </div>
    `;
  }

  getChartColumn(value) {
    return `<div style="--value: ${value.value}" data-tooltip="${value.percent}%"></div>`;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  loadData() {
    fetch()
    update();
  }

  update() {

  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  update(data = []) {
    this.data = data;
    this.render();
  }

  addColumns(container) {
    const calvValues = this.calcColumnValue(this.data);
    for (const value of calvValues) {
      const element = document.createElement('div');
      element.style.setProperty("--value", value.value);
      element.dataset["tooltip"] = `${value.percent}%`;
      container.appendChild(element);
    }
  }

  calcColumnValue(arr) {
    const maxValue = Math.max(...arr);
    const scale = ColumnChart.chartHeight / maxValue;
    return arr.map(oldValue => {
      return {
        value: Math.floor(oldValue * scale),
        percent: (oldValue / maxValue * 100).toFixed(0)
      };
    });
  }
}
