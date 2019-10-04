import { PanelLayout } from "@phosphor/widgets";

import { NotebookTools, INotebookTracker } from "@jupyterlab/notebook";

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
    let layout = (this.layout = new PanelLayout());
    this.widget = new TagWidget();
    layout.addWidget(this.widget);
  }

  /**
   * Handle a change to the active cell.
   */
  protected onActiveCellChanged(): void {}

  /**
   * Handle a change to cell selection in the notebook.
   */
  protected onSelectionChanged(): void {}

  /**
   * Get all tags once available.
   */
  protected onAfterShow() {}

  /**
   * Get all tags once available.
   */
  protected onAfterAttach() {
    this.tracker.currentWidget.context.ready.then(() => {});
    this.tracker.currentChanged.connect(() => {});
    this.tracker.currentWidget.model.cells.changed.connect(() => {});
  }

  /**
   * Handle a change to active cell metadata.
   */
  protected onActiveCellMetadataChanged(): void {}

  private widget: TagWidget = null;
  public tracker: INotebookTracker = null;
}
