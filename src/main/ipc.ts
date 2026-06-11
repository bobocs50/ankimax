import { register as registerFlashcard } from './ipc_routes/flashcard';
import { register as registerMessage } from './ipc_routes/message';
import { register as registerWindow } from './ipc_routes/window';

registerFlashcard();
registerMessage();
registerWindow();
