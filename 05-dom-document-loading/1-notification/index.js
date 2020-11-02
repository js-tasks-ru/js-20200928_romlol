export default class NotificationMessage {
  static currentNotification;
  constructor(
    message = '',
    {
      duration = 2000,
      type = 'success'
    } = {}) {
    if (NotificationMessage.currentNotification) {
      NotificationMessage.currentNotification.remove();
    }
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.render();
  }

  get notificationTemplate() {
    return `
      <div class="notification ${this.type}" style="--value:${(this.duration / 1000)}s">
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

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.notificationTemplate;
    NotificationMessage.currentNotification = this.element = element.firstElementChild;
  }

  show(container = document.body) {
    container.append(this.element);
    setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

}
