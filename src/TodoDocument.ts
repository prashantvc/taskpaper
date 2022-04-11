import { traceDeprecation } from "process";
import { TextDocument, TextLine, Position, Range, tasks } from "vscode";

export class TodoDocument {
  public static projectSymbol = ":";
  public static newTask = "☐";
  public static doneTask = "✔";
  public static cancelTask = "✘";
  public static tagSymbol = "@";

  public static critalTag = "critical";
  public static highTag = "high";
  public static lowTag = "low";
  public static todayTag = "today";

  public static actionDone = "done";
  public static actionCancel = "cancel";

  public getProject(pos: Position): Project {
    let line = this._textDocument.lineAt(pos.line);
    let projectText = line.text.trim();

    if (projectText.endsWith(TodoDocument.projectSymbol)) {
      return new Project(line);
    }

    return null as any;
  }

  public getTasks(): Task[] {
    let result: Task[] = [];
    var text = this._textDocument.getText();
    var regTx = /^\s*[☐|✘|✔]/gm;

    var match;
    while ((match = regTx.exec(text))) {
      let line = this._textDocument.lineAt(
        this._textDocument.positionAt(match.index + 1).line
      );
      let task = new Task(line);
      result.push(task);
    }

    return result;
  }

  public getTask(pos: Position): Task {
    if (!this.isTask(pos)) {
      return null as any;
    }

    let line = this._textDocument.lineAt(pos.line);
    let task = new Task(line);
    return task;
  }

  public isTask(pos: Position): boolean {
    let line = this._textDocument.lineAt(pos.line).text.trim();
    return (
      line.startsWith(TodoDocument.newTask) ||
      line.startsWith(TodoDocument.doneTask) ||
      line.startsWith(TodoDocument.cancelTask)
    );
  }

  public static toTag(tagName: string): string {
    return TodoDocument.tagSymbol + tagName;
  }

  constructor(private _textDocument: TextDocument) {}
}

export class Task {
  public getDescription(): string {
    if (this.done()) {
      let index = this.taskText.indexOf(
        TodoDocument.toTag(TodoDocument.actionDone)
      );
      return index !== -1
        ? this.taskText.substring(TodoDocument.doneTask.length, index).trim()
        : this.taskText.substring(TodoDocument.doneTask.length).trim();
    }

    if (this.cancelled()) {
      let index = this.taskText.indexOf(
        TodoDocument.toTag(TodoDocument.actionCancel)
      );
      return index !== -1
        ? this.taskText.substring(TodoDocument.cancelTask.length, index).trim()
        : this.taskText.substring(TodoDocument.cancelTask.length).trim();
    }

    return this.taskText.substring(TodoDocument.newTask.length).trim();
  }

  public isEmpty(): boolean {
    return !this.getDescription().trim();
  }
  public cancelled(): boolean {
    return this.taskText.indexOf(TodoDocument.cancelTask) !== -1;
  }
  public done(): boolean {
    return this.taskText.indexOf(TodoDocument.doneTask) !== -1;
  }

  public hasTag(tag: string): boolean {
    return (
      this.taskText
        .toLocaleLowerCase()
        .indexOf(TodoDocument.toTag(tag).toLocaleLowerCase()) !== -1
    );
  }

  public getTags(): string[] {
    var result: string[] = [];
    var match;

    while ((match = this.regEx.exec(this.taskText))) {
      if (
        TodoDocument.toTag(TodoDocument.actionCancel) !== match[0] &&
        TodoDocument.toTag(TodoDocument.actionDone) !== match[0]
      ) {
        result.push(match[0]);
      }
    }
    return result;
  }

  public getTagsRanges(): Range[] {
    var result: Range[] = [];
    var match;
    while ((match = this.regEx.exec(this.taskText))) {
      if (
        TodoDocument.toTag(TodoDocument.actionCancel) !== match[0] &&
        TodoDocument.toTag(TodoDocument.actionDone) !== match[0]
      ) {
        let start: Position = this.taskLine.range.start;
        let startPosition = new Position(
          start.line,
          this.taskLine.firstNonWhitespaceCharacterIndex + match.index
        );
        let endPosition = new Position(
          start.line,
          this.taskLine.firstNonWhitespaceCharacterIndex +
            match.index +
            match[0].length
        );
        result.push(new Range(startPosition, endPosition));
      }
    }
    return result;
  }

  constructor(public taskLine: TextLine) {
    this.taskText = taskLine.text.trim();
  }
  taskText: string;
  regEx = /@[^@\s]+/g;
}

export class Project {
  constructor(public line: TextLine) {}
}
