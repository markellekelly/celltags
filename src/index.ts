import { JupyterLab, JupyterFrontEndPlugin } from "@jupyterlab/application";

import { INotebookTools, INotebookTracker } from "@jupyterlab/notebook";

import { TagTool } from "./tool";

// import '../style/index.css';

/**
 * Initialization data for the jupyterlab-celltags extension.
 */
function activate(
  app: JupyterLab,
  tools: INotebookTools,
  tracker: INotebookTracker
) {
  app;
  tools;
  tracker;
  const tool = new TagTool(tracker, app);
  tools.addItem({ tool: tool, rank: 1.7 });
  console.log("activated!!!!");
}

const extension: JupyterFrontEndPlugin<void> = {
  id: "celltags",
  autoStart: true,
  requires: [INotebookTools, INotebookTracker],
  activate: activate
};

export default extension;
