import { PanelLayout } from "@phosphor/widgets";

import { NotebookTools, INotebookTracker } from "@jupyterlab/notebook";

//import { Cell } from '@jupyterlab/cells';

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
    if (this.tracker.activeCell) {
      let tags= this.tracker.activeCell.model.metadata.get('tags') as string[];
      if (tags) {
        for (let i=0; i<tags.length;i++){
          if (tags[i] === name ) {
            return true;
          }
        }
      }
    }
    return false;
  }

  addTag(name:string) {
    let cell = this.tracker.activeCell;
    let tagList = cell.model.metadata.get('tags') as string[];
    let newTags = name.split(/[,\s]+/);
    if (tagList === undefined) {
      tagList = [];
    } 
    const toAdd: string[] = [];
    for (let i = 0; i < newTags.length; i++) {
      if (newTags[i] !== '' && toAdd.indexOf(newTags[i]) < 0) {
        toAdd.push(newTags[i]);
      }
    }
    for (let j = 0; j < toAdd.length; j++) {
      if (tagList.indexOf(toAdd[j]) < 0) {
        tagList.push(toAdd[j]);
      }
    }
    cell.model.metadata.set('tags', tagList);
    this.parent.update();
  }

  removeTag(name:string) {
    let cell = this.tracker.activeCell;
    let tagList = cell.model.metadata.get('tags') as string[];
    let idx = tagList.indexOf(name);
    if (idx > -1){
      tagList.splice(idx,1);
    }
    cell.model.metadata.set('tags', tagList);
    if (tagList.length === 0) {
      cell.model.metadata.delete('tags');
    }
    this.refreshTags();
    this.loadActiveTags();
    this.parent.update();
  }

  loadActiveTags() {
    let layout = this.layout as PanelLayout;
    for (let i=0; i<layout.widgets.length; i++) {
      layout.widgets[i].update();
    }
  }

  /**
   * Pull from cell metadata all the tags assigned to notebook cells,
   */
 pullTags() {
    let notebook = this.tracker.currentWidget;
    if (this.tracker && this.tracker.currentWidget) {
      let cells = notebook.model.cells;
      let allTags = null;
      for (var i = 0; i < cells.length; i++) {
        let metadata = cells.get(i).metadata;
        let tags = metadata.get('tags') as string[];
        if (tags) {
          for (var j = 0; j < tags.length; j++) {
            let name = tags[j];
            if (name !== '') {
              if (allTags == null) {
                allTags = [name];
              } else if (allTags.indexOf(name) < 0) {
                allTags.push(name);
              }
            }
          }
          this.tagList = allTags;
        }
      }
    }
  }

  refreshTags() {
    this.pullTags();
    let layout = this.layout as PanelLayout;
    let tags: string[] = this.tagList;
    let nWidgets = layout.widgets.length-1
    for (let i=nWidgets; i>=0; i--) {
      let idx = tags.indexOf((layout.widgets[i] as TagWidget).name)
      if (idx < 0) {
        layout.widgets[i].dispose();
      } else {
        tags.splice(idx,1);
      }
    }
    for (let i=0; i<tags.length;i++){
      let widget = new TagWidget(tags[i]);
      layout.addWidget(widget);
    }
  }

  /**
   * Handle a change to the active cell.
   */
  protected onActiveCellChanged(): void {
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
    this.refreshTags();
    this.loadActiveTags();
  }

  /**
   * Get all tags once available.
   */
  protected onAfterAttach() {
    this.tracker.currentWidget.context.ready.then(() => {
      this.refreshTags();
      this.loadActiveTags();
    });
    this.tracker.currentChanged.connect(() => {
      this.refreshTags();
      this.loadActiveTags();
    });
    this.tracker.currentWidget.model.cells.changed.connect(() => {
      this.refreshTags();
      this.loadActiveTags();
    });
  }

  /**
   * Handle a change to active cell metadata.
   */
  protected onActiveCellMetadataChanged(): void {
    this.refreshTags();
    this.loadActiveTags();
  }

  private tagList: string[] = [];
  public tracker: INotebookTracker = null;
}
