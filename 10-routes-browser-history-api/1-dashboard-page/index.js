import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import TableHeader from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  components = {};

  constructor() {

  }

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.pageTemplate;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);

    this.initComponents();
    this.renderComponents();
    this.initEventListeners();

    return this.element;
  }

  initComponents() {
    const to = new Date();
    const from = new Date(to.getTime() - (30 * 24 * 60 * 60 * 1000));

    this.components.rangePicker = new RangePicker({
      from,
      to
    });

    this.components.ordersChart = new ColumnChart({
      url: 'api/dashboard/orders',
      label: 'Заказы',
      range: {
        from,
        to
      },
      link: '#'
    });

    this.components.salesChart = new ColumnChart({
      url: 'api/dashboard/sales',
      label: 'Продажи',
      formatHeading: data => `$${data}`,
      range: {
        from,
        to
      }
    });

    this.components.customersChart = new ColumnChart({
      url: 'api/dashboard/customers',
      label: 'Клиенты',
      range: {
        from,
        to
      }
    });

    this.components.sortableTable = new SortableTable(TableHeader, {
      url: `api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`,
      isSortLocally: true
    });
  }

  renderComponents() {
    Object.keys(this.components).forEach(component => {
      const { element } = this.components[component];
      const root = this.subElements[component];
      root.append(element);
    });
  }

  initEventListeners() {
    this.components.rangePicker.element.addEventListener('date-select', event => {
      const { from, to } = event.detail;

      this.updateComponents(from, to);
    });
  }

  async updateComponents(from, to) {
    this.components.ordersChart.update(from, to);
    this.components.salesChart.update(from, to);
    this.components.customersChart.update(from, to);

    const data = await fetchJson(`${BACKEND_URL}api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`);
    this.components.sortableTable.addRows(data);
  }


  getSubElements(element) {
    const subElements = {};

    for (const subElement of element.querySelectorAll('[data-element]')) {
      subElements[subElement.dataset.element] = subElement;
    }

    return subElements;
  }

  get pageTemplate() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Панель управления</h2>
          <!-- RangePicker -->
          <div data-element="rangePicker"></div>
        </div>
        <!-- ColumnCharts -->
        <div data-element="chartsRoot" class="dashboard__charts">
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>
        <h3 class="block-title">Лидеры продаж</h3>
        <!-- SortableTable -->
        <div data-element="sortableTable"></div>
      </div>
    `;
  }

  remove() {
    this.element.remove();
  }

  destroy () {
    this.remove();

    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
