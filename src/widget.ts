import { Widget } from "@phosphor/widgets";

import { TagTool } from './tool';

/**
 * A widget which hosts a cell tags area.
 */
export class TagWidget extends Widget {
  /**
   * Construct a new tag widget.
   */
  constructor(name: string) {
    super();
    this.applied = true;
    this.name = name;
    this.addClass("tag");
    this.buildTag();
  }

  buildTag() {
    let text = document.createElement('span');
    text.textContent = this.name;
    let tag = document.createElement('div');
    tag.className = "tag-holder";
    tag.appendChild(text);
    let img = document.createElement('span');
    img.className = "check-icon";
    if (this.applied) {
      this.addClass("applied-tag");
    } else {
      this.addClass("unapplied-tag");
      img.style.display = "none";
    }
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
        this._evtClick();
        break;
      case 'mouseover':
        this._evtHover(event as MouseEvent);
      default:
        break;
    }
  }

  onUpdateRequest() {
    let applied = this.parent.checkApplied(this.name);
    if (applied != this.applied) {
      this.toggleApplied();
    }
  }

  toggleApplied() {
    if (this.applied) {
      this.removeClass("applied-tag");
      (this.node.firstChild.lastChild as HTMLSpanElement).style.display = "none";
      this.addClass("unapplied-tag");
    } else {
      this.removeClass("unapplied-tag");
      (this.node.firstChild.lastChild as HTMLSpanElement).style.display = "inline-block";
      this.addClass("applied-tag");
    }
    this.applied = !this.applied;
  }

  private _evtClick() {
    if (this.applied) {
      this.parent.removeTag(this.name);
    } else {
      this.parent.addTag(this.name);
    }
    this.toggleApplied();
  }

  private _evtHover(event: MouseEvent) {
    event;
  }

  public name: string;
  private applied: boolean;
  public parent: TagTool;
}
