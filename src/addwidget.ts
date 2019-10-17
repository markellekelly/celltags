import { Widget } from "@phosphor/widgets";

import { TagTool } from './tool';

/**
 * A widget which hosts a cell tags area.
 */
export class AddWidget extends Widget {
  /**
   * Construct a new tag widget.
   */
  constructor() {
    super();
    this.addClass("tag");
    this.editing = false;
    this.buildTag();
  }

  buildTag() {
    // let text = document.createElement('input');
    // text.style.border = "none";
    // text.defaultValue = "Add Tag";
    let text = document.createElement('span');
    text.textContent = "Add Tag";
    text.contentEditable = "true";
    text.className = "add-tag";
    let tag = document.createElement('div');
    tag.className = "tag-holder";
    tag.appendChild(text);
    let img = document.createElement('span');
    img.className = "add-icon";
    this.addClass("unapplied-tag");
    img.style.display = "none";
    tag.appendChild(img);
    this.node.appendChild(tag);
  }

  onAfterAttach() {
    this.node.addEventListener('mousedown', this);
    this.node.addEventListener('mouseover', this);
  }

  onBeforeDetach() {
    this.node.removeEventListener('mousedown', this);
    this.node.addEventListener('mouseover', this);
  }

  handleEvent(event: Event): void {
    switch (event.type) {
      case 'mousedown':
        this._evtClick(event as MouseEvent);
        break;
      case 'mouseover':
        this._evtHover(event as MouseEvent);
      default:
        break;
    }
  }

  private _evtClick(event: MouseEvent) {
    if (!this.editing) {
      this.editing = true;
      let target = event.target as HTMLSpanElement;
      target;
      //target.textContent = 'm';
    } 
  }

  private _evtHover(event: MouseEvent) {
    event;
  }

  public parent: TagTool;
  private editing: boolean;
}
