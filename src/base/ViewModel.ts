import { action, observable, runInAction } from 'mobx';
import { applySnapshot, getSnapshot, onSnapshot } from '..';

export default abstract class ViewModelBase {
	@observable
	protected stack: any[] = [];

	@observable
	protected cursor = 0;

	@action.bound
	enableRedoUndo() {
		this.stack.push(getSnapshot());

		return onSnapshot(snapshot => {
			runInAction(() => {
				this.stack.push(snapshot);
				this.cursor = this.stack.length - 1;
			});
		});
	}

	@action.bound
	redo() {
		const tmp = this.cursor + 1;
		if (tmp >= this.stack.length) {
			return;
		}
		applySnapshot(this.stack[++this.cursor]);
	}

	@action.bound
	undo() {
		const tmp = this.cursor - 1;
		if (tmp < 0) {
			return;
		}
		applySnapshot(this.stack[--this.cursor]);
	}
}