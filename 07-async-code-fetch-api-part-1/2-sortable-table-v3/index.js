import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  headersConfig = [];
  data = [];
  isLoaded = false;
  isLoadableMore = true;
  pageSize = 30;
  loadedPages = 0;

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };

      return orders[order];
    };

    if (column) {

      const { id, order } = column.dataset;
      this.sorted.id = id;
      this.sorted.order = toggleOrder(order);
      this.update();

      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = this.sorted.order;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }
    }
  };

  onScroll = async event => {
    console.log(this.isLoaded);
    if (this.isLoaded) {
      return;
    }
    if (this.element.getBoundingClientRect().bottom < document.documentElement.clientHeight && this.isLoadableMore) {
      const result = await this.loadRows();
      this.data = this.data.concat(result);
      this.subElements.body.innerHTML = this.getTableRows(this.data);
      this.isLoaded = false;
    }
  }

  constructor(headersConfig, {
    url = "api/rest/products",
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.url = new URL(url, BACKEND_URL);
    this.render();
    this.initEventListeners();
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow ({id, title, sortable}) {
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.getHeaderSortingArrow(id)}
      </div>
    `;
  }

  getHeaderSortingArrow (id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
  }

  getTableBody(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(data)}
      </div>`;
  }

  getTableRows (data) {
    return data.map(item => `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.getTableRow(item, data)}
      </a>`
    ).join('');
  }

  getTableRow (item) {
    const cells = this.headersConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable(data) {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody(data)}
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
          </div>
        </div>
      </div>`;
  }

  async render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable([]);

    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    this.initEventListeners();
    await this.update();
  }

  async update() {
    this.element.classList.add("sortable-table_loading");
    this.data = await this.loadRows();
    this.subElements.body.innerHTML = this.getTableRows(this.data);
    this.element.classList.remove("sortable-table_loading");
    this.isLoaded = false;

    if (this.data.length === 0) {
      this.element.classList.add("sortable-table_empty");
    }
  }

  async loadRows() {
    const options = {
      sort: this.sorted.id,
      order: this.sorted.order,
      start: this.loadedPages * this.pageSize,
      end: (this.loadedPages * this.pageSize + this.pageSize)
    };
    this.isLoaded = true;
    for (let key in options) {
      this.url.searchParams.set("_" + key, options[key]);
    }
    this.loadedPages++;
    return await fetchJson(this.url);
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
    document.addEventListener("scroll", this.onScroll);
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
    this.subElements = {};
  }
}
