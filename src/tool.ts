import { PanelLayout } from "@phosphor/widgets";

import { NotebookTools, INotebookTracker } from "@jupyterlab/notebook";

import { Cell } from '@jupyterlab/cells';

import { JupyterFrontEnd } from "@jupyterlab/application";

import { TagWidget } from "./widget";

/**
 * A Tool for tag operations.
 */
export class TagTool extends NotebookTools.Tool {
  /**
   * Construct a new tag Tool.
   *
   * @param tracker - The notebook tracker.
   */
  constructor(tracker: INotebookTracker, app: JupyterFrontEnd) {
    super();
    app;
    this.tracker = tracker;
    this.layout = new PanelLayout();
  }

  checkApplied(name:string):boolean {
    if (this.activeCell) {
      let tags= this.activeCell.model.metadata.get('tags') as string[];
      if (tags) {
        for (let i=0; i<tags.length;i++){
          if (tags[i] === name )
          return true;
        }
      }
    }
    return false;
  }

  addTag(name:string) {
    let layout = this.layout as PanelLayout;
    let tag = new TagWidget(name);
    layout.addWidget(tag);
  }

  /**
   * Add or remove a tag from cell metadata.
   *
   * @param cell - The cell the tag is being applied to.
   *
   * @param name - The tag name.
   *
   * @param add - Whether the tag is being added or removed.
   */
  write_tag(name: string, add: boolean) {
    let cell = this.activeCell;
    if (name === '') {
      //do nothing if tag is a blank string - can't add or remove
      return;
      // If add = true, check if the tag already exists and add to metadata if applicable
    } else if (add) {
      let wtaglist = cell.model.metadata.get('tags') as string[];
      let new_tags = name.split(/[,\s]+/);
      if (wtaglist === undefined) {
        wtaglist = [];
      } else {
        if (new_tags.length === 1 && wtaglist.indexOf(new_tags[0]) > -1) {
          return;
        }
      }
      const to_add: string[] = [];
      for (let tag = 0; tag < new_tags.length; tag++) {
        if (new_tags[tag] !== '' && to_add.indexOf(new_tags[tag]) < 0) {
          to_add.push(new_tags[tag]);
        }
      }
      const new_list: string[] = [];
      for (let i = 0; i < wtaglist.length; i++) {
        new_list.push(wtaglist[i]);
      }
      for (let j = 0; j < to_add.length; j++) {
        if (new_list.indexOf(to_add[j]) < 0) {
          new_list.push(to_add[j]);
        }
      }
      cell.model.metadata.set('tags', new_list);
      // If add = false, remove from metadata and remove metadata.tags if empty.
    } else {
      if (!cell.model.metadata || !cell.model.metadata.get('tags')) {
        // No tags to remove
        return;
      }
      let rtaglist = cell.model.metadata.get('tags') as string[];
      var new_list: string[] = [];
      for (var i = 0; i < rtaglist.length; i++) {
        if (rtaglist[i] != name) {
          new_list.push(rtaglist[i]);
        }
      }
      cell.model.metadata.set('tags', new_list);
      let updated = cell.model.metadata.get('tags') as string[];
      if (updated.length === 0) {
        cell.model.metadata.delete('tags');
      }
    }
  }

  loadActiveTags() {
    let layout = this.layout as PanelLayout;
    if (this.activeCell != null) {
      for (let i=0; i<layout.widgets.length; i++) {
        layout.widgets[i].update();
      }
    }
  }

  /**
   * Pull from cell metadata all the tags assigned to notebook cells,
   */
 refreshTagList() {
    let notebook = this.tracker.currentWidget;
    if (this.tracker && this.tracker.currentWidget) {
      let cells = notebook.model.cells;
      let allTagsInNotebook = null;
      for (var i = 0; i < cells.length; i++) {
        let cellMetadata = cells.get(i).metadata;
        let cellTagsData = cellMetadata.get('tags') as string[];
        if (cellTagsData) {
          for (var j = 0; j < cellTagsData.length; j++) {
            let name = cellTagsData[j];
            if (name !== '') {
              if (allTagsInNotebook == null) {
                allTagsInNotebook = [name];
              } else if (allTagsInNotebook.indexOf(name) < 0) {
                allTagsInNotebook.push(name);
              }
            }
          }
          this.tagList = allTagsInNotebook;
        }
      }
    }
    console.log(this.tagList);
  }

  /**
   * Handle a change to the active cell.
   */
  protected onActiveCellChanged(): void {
    this.activeCell = this.tracker.activeCell;
    this.loadActiveTags();
  }

  /**
   * Handle a change to cell selection in the notebook.
   */
  protected onSelectionChanged(): void {}

  /**
   * Get all tags once available.
   */
  protected onAfterShow() {
    this.activeCell = this.tracker.activeCell;
    this.refreshTagList();
    this.loadActiveTags();
  }

  /**
   * Get all tags once available.
   */
  protected onAfterAttach() {
    // this.tracker.currentWidget.context.ready.then(() => {});
    // this.tracker.currentChanged.connect(() => {});
    // this.tracker.currentWidget.model.cells.changed.connect(() => {});
  }

  /**
   * Handle a change to active cell metadata.
   */
  protected onActiveCellMetadataChanged(): void {
    this.refreshTagList();
    this.loadActiveTags();
  }

  private tagList: string[] = [];
  private activeCell: Cell;
  public tracker: INotebookTracker = null;
}
