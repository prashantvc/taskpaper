import { TextDecoder } from "util";
import { Range, TextEditor, TextEditorDecorationType } from "vscode";
import { TodoDocument, Task } from "./TodoDocument";

export default class TodoDocumentEditor {
  public performDecoration(delayed?: boolean) {}
  doPerform() {
    var todoDocument = new TodoDocument(this._textEditor.document);
  }
  constructor(private _textEditor: TextEditor) {}
  private timeout: number = null;
}

class TaskDecorator {
  public getDecorationTypes(tasks: Task[]): DecorationTypeWithRanges[] {
    var result: DecorationTypeWithRanges[] = [];
    //result = result.concat(new )
    return result;
  }
}

interface DecorationTypeWithRanges {
  decorationType: TextEditorDecorationType;
  ranges: Range[];
}
