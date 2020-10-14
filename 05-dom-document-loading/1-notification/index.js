export default class NotificationMessage {
  constructor(
    message = '',
    {
      duration = 0,
      type = 'success'
    } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.create();
  }

  get notification() {
    return `
      <div class="notification ${this.type}" style="--value:${Math.floor(this.duration / 1000)}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
              ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  create() {
    const element = document.createElement('div');
    element.innerHTML = this.notification;
    this.element = element.firstElementChild;
    this.element.hidden = true;
  }

  show(container = document.body) {
    this.element.hidden = false;
    this.container = container;
    this.container.append(this.element);
    setTimeout(() => this.destroy(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
