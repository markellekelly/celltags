import { Widget } from "@phosphor/widgets";

/**
 * A widget which hosts a cell tags area.
 */
export class TagWidget extends Widget {
  /**
   * Construct a new tag widget.
   */
  constructor() {
    super();
    this.addClass("unapplied-tag");
    this.node.innerText = "testtag";
    let img = document.createElement('span');
    img.className = "tag-icon";
    this.node.appendChild(img);
  }

  onAfterAttach() {
    this.node.addEventListener('mousedown', this);
  }

  onBeforeDetach() {
    this.node.removeEventListener('mousedown', this);
  }

  handleEvent(event: Event): void {
    switch (event.type) {
      case 'mousedown':
        this._evtClick(event as MouseEvent);
        break;
      default:
        break;
    }
  }

  private _evtClick(event: MouseEvent) {
    console.log(event.target);
  }
}
