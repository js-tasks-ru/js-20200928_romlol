import customFetch from './utils/fetch-json.js';
import escapeHtml from './utils/escape-html.js';
export default class ColumnChart {
  chartHeight = 50;

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
    this.url = new URL(url, "https://course-js.javascript.ru");
    this.label = label;
    this.value = value;
    this.link = link;
    this.range = range;
    this.calcValues = [];
    this.render();
  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
    document.body.appendChild(this.element);
    await this.update();
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
      <div class="column-chart">
        <div class="column-chart__title">
        Total ${this.label}
        ${this.getLink}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.getColumns}
        </div>
      </div>
    </div>
    `;
  }

  get getColumns() {
    return `
        ${this.calcValues.map(value => this.getChartColumn(value)).join('')}
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

  async update(from = this.range.from, to = this.range.to) {
    this.element.classList.add('column-chart_loading');
    this.url.searchParams.set("from", from);
    this.url.searchParams.set("to", to);
    const result = await customFetch(this.url);
    this.updateData(result);
    this.subElements.header.innerHTML = this.value;
    this.subElements.body.innerHTML = this.getColumns;
    this.element.classList.remove('column-chart_loading');
  }

  updateData(data) {
    const countData = [];
    this.value = 0;
    for (const value of Object.entries(data).values()) {
      countData.push(value[1]);
      this.value += value[1];
    }
    this.calcValues = this.calcColumnValue(countData);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  calcColumnValue(arr) {
    const maxValue = Math.max(...arr);
    const scale = this.chartHeight / maxValue;
    return arr.map(oldValue => {
      return {
        value: Math.floor(oldValue * scale),
        percent: (oldValue / maxValue * 100).toFixed(0)
      };
    });
  }
}
