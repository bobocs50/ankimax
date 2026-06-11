import { register as registerFlashcard } from './ipc/flashcard';
import { register as registerMessage } from './ipc/message';
import { register as registerWindow } from './ipc/window';

registerFlashcard();
registerMessage();
registerWindow();
