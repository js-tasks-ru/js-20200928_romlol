export default class SortableTable {
  orderType = {
    asc: 1,
    desc: -1
  };

  static sortFunctions = {
    'number': (a, b) => {
      return a - b;
    },
    'string': (a, b) => {
      return a.localeCompare(b, 'ru');
    }
  };

  constructor(
    headerInfo = [], {
      data = []
    } = {}) {
    this.headerInfo = headerInfo;
    this.data = data;
    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.tableTemplate;
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);
    if (this.defaultSort) {
      this.sort(this.defaultSort, 'asc');
    }

    this.addEventListener();
  }

  sort(fieldValue, order = 'asc') {
    if (this.orderType[order]) {
      this.sortTable(fieldValue, order);
    }
  }

  addEventListener() {
    this.headerRow = this.element.querySelector('.sortable-table__header.sortable-table__row');
    this.headerRow.addEventListener('click', this.onHeaderClick.bind(this));
  }

  onHeaderClick(event) {
    const column = event.target.closest('.sortable-table__cell');

    if (!column && column.dataset.sortable) {
      return;
    }

    if (!this.headerRow.contains(column)) {
      return;
    }
    const currentSort = column.dataset.order === '' ? 'desc' : column.dataset.order;
    switch (currentSort) {
    case 'asc':
      this.sort(column.dataset.id, 'desc');
      break;
    case 'desc':
    default:
      this.sort(column.dataset.id, 'asc');
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  sortTable(field, order) {
    const allHeaderColumn = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    allHeaderColumn.forEach(column => {
      column.dataset.order = '';
    });
    const newSortedColumn = this.element.querySelector(`.sortable-table__cell[data-id='${field}']`);
    newSortedColumn.dataset.order = order;
    const newSorterData = this.sortData(field, this.orderType[order]);
    this.subElements.body.innerHTML = this.getTableRows(newSorterData);
  }

  sortData(field, direction) {
    const sortArr = [...this.data];
    const sortColumn = this.headerInfo.find(item => item.id === field);
    const sortType = sortColumn.sortType;
    return sortArr.sort((a, b) => direction * SortableTable.sortFunctions[sortType].call(this, a[field], b[field]));
  }

  get tableTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
        ${this.getTableHeader}
        ${this.tableBody}
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
    `;
  }

  get getTableHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerInfo.map(column => this.getHeaderColumn(column)).join('')}
      </div>
    `;
  }

  getHeaderColumn({
    order = '',
    id = 0,
    sortable = false,
    title = 'Title',
    sorted = false
  } = {}) {
    if (sorted || (sortable && !this.defaultSort)) {
      this.defaultSort = id;
    }
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.getSortingArrow}
      </div>
    `;
  }

  get getSortingArrow() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  get tableBody() {
    return `
      <div data-element="body" class="sortable-table__body">
      </div>
    `;
  }

  getTableRows(data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.headerInfo.map(header => this.getCellDataTemplate(header, item[header.id])).join('')}
        </a>
      `;
    }).join('');

  }

  getCellDataTemplate(headerInfo, data) {
    if (headerInfo.template) {
      return headerInfo.template(data);
    } else {
      return `
        <div class="sortable-table__cell">
          ${data}
        </div>
      `;
    }
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }
}
