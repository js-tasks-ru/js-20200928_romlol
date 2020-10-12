export default class ColumnChart {
  constructor (objData = {}) {
    this.chartHeight = 50;
    this.data = objData.data || [];
    this.label = objData.label || "";
    this.value = objData.value || "";
    this.link = objData.link || "";
    this.loading = false;
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.className = 'column-chart';
    if (!this.data.length) {
      element.classList.add("column-chart_loading");
      this.loading = true;
    }
    element.appendChild(this.getChartTitle());
    element.appendChild(this.getChartContainer());
    this.element = element;
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

  getChartTitle() {
    const element = document.createElement('div');
    element.className = 'column-chart__title';
    element.innerHTML = `Total ${this.label}`;
    this.addLink(element);
    return element;
  }

  addLink(title) {
    if (this.link) {
      const element = document.createElement('a');
      element.className = 'column-chart__link';
      element.innerHTML = `View all`;
      element.href = this.link;
      title.appendChild(element);
    }
  }

  getChartContainer() {
    const element = document.createElement('div');
    element.className = 'column-chart__container';
    this.addColumnHeader(element);
    this.addColumnBody(element);
    return element;
  }

  addColumnHeader(container) {
    const element = document.createElement('div');
    element.className = 'column-chart__header';
    element.dataset["element"] = 'header';
    element.innerHTML = `${this.value}`;
    container.appendChild(element);
  }

  addColumnBody(container) {
    const element = document.createElement('div');
    element.dataset["element"] = 'body';
    element.className = 'column-chart__chart';
    if (!this.loading) {
      this.addColumns(element);
    }
    container.appendChild(element);
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
    const scale = this.chartHeight / maxValue;
    return arr.map(oldValue => {
      return {
        value: Math.floor(oldValue * scale),
        percent: (oldValue / maxValue * 100).toFixed(0)
      };
    });
  }
}
