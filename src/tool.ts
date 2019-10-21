import { PanelLayout } from "@phosphor/widgets";

import { NotebookTools, INotebookTracker } from "@jupyterlab/notebook";

//import { Cell } from '@jupyterlab/cells';

import { JupyterFrontEnd } from "@jupyterlab/application";

import { TagWidget } from "./widget";

import { AddWidget } from './addwidget';

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
    this.createTagInput();
  }

  createTagInput() {
    let layout = this.layout as PanelLayout;
    let input = new AddWidget();
    input.id = "add-tag";
    layout.insertWidget(0, input);
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
    let tags = cell.model.metadata.get('tags') as string[];
    let newTags = name.split(/[,\s]+/);
    if (tags === undefined) {
      tags = [];
    } 
    const toAdd: string[] = [];
    for (let i = 0; i < newTags.length; i++) {
      if (newTags[i] !== '' && toAdd.indexOf(newTags[i]) < 0) {
        toAdd.push(newTags[i]);
      }
    }
    for (let j = 0; j < toAdd.length; j++) {
      if (tags.indexOf(toAdd[j]) < 0) {
        tags.push(toAdd[j]);
      }
    }
    cell.model.metadata.set('tags', tags);
    console.log(this.tracker.activeCell.model.metadata.get('tags'));
  }

  removeTag(name:string) {
    let cell = this.tracker.activeCell;
    let tags = cell.model.metadata.get('tags') as string[];
    let idx = tags.indexOf(name);
    if (idx > -1){
      tags.splice(idx,1);
    }
    cell.model.metadata.set('tags', tags);
    if (tags.length === 0) {
      cell.model.metadata.delete('tags');
    }
    this.refreshTags();
    this.loadActiveTags();
    console.log(this.tracker.activeCell.model.metadata.get('tags'));
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
      let allTags:string[] = [];
      for (var i = 0; i < cells.length; i++) {
        // console.log("CELL: " );
        // console.log(cells.get(i).value);
        let metadata = cells.get(i).metadata;
        let tags = metadata.get('tags') as string[];
        // console.log("TAGS: ");
        // console.log(tags);
        if (tags) {
          for (var j = 0; j < tags.length; j++) {
            let name = tags[j] as string;
            if (name !== '') {
              console.log("FOUND TAG: " + name);
              if (allTags.indexOf(name) < 0) {
                // console.log("pushing to all tags");
                // console.log(allTags);
                // console.log(name);
                allTags.push(name);
                // console.log(x);
                // console.log(allTags.length);
                // console.log(allTags);
                // if (allTags.length > 0) {
                //   console.log(allTags[0]);
                // }
              }
            }
          }
        }
      }
      // let test:string[] = [];
      // console.log(test);
      // let name = "bruhhhhh";
      // test.push(name);
      // console.log(test);
      // console.log("ALL TAGS: ");
      this.tagList = allTags;
      // console.log(this.tagList.length);
      // console.log(this.tagList);
    }
  }

  refreshTags() {
    this.pullTags();
    let layout = this.layout as PanelLayout;
    console.log(layout.widgets);
    console.log(this.tagList);
    let tags: string[] = this.tagList;
    console.log(tags);
    let nWidgets = layout.widgets.length;
    for (let i=0; i<nWidgets-1; i++) {
      console.log((layout.widgets[i] as TagWidget).name);
      let idx = tags.indexOf((layout.widgets[i] as TagWidget).name)
      if (idx < 0 && layout.widgets[i].id != "add-tag") {
        layout.widgets[i].dispose();
      } else {
        console.log("updating tags");
        tags.splice(idx,1);
        console.log(tags);
      }
    }
    console.log("TAGS");
    console.log(tags);
    console.log(tags.length);
    for (let i=0; i<tags.length;i++){
      console.log(tags[i])
      let widget = new TagWidget(tags[i]);
      let idx = layout.widgets.length -1;
      layout.insertWidget(idx, widget);
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
    this.tagList;
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
