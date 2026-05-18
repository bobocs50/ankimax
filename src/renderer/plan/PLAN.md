# Prompt Bar Window Plan

## Phase 1
- [x] Remove page content so the renderer only shows the prompt bar.
- [x] Keep the renderer background transparent outside the bar.

## Phase 2
- [x] Convert the Electron window to a frameless transparent window.
- [x] Size the Electron window around the prompt bar instead of a full app shell.dfl
- [x] Start the window near the top-center of the screen.

## Phase 3
- [x] Add a dedicated `PromptBar` component for the bar UI only.
- [x] Mount only the prompt bar from `src/renderer/pages/home/index.tsx`.

## Phase 4
- [x] Make the bar draggable by using Electron drag regions.
- [x] Keep the buttons and input interactive with `no-drag` regions.asdfsadfasdf

## Phase 5
- [x] Remove native title bar controls from the visible UI.
- [x] Keep the window fixed-size so only the bar is shown.

## Phase 6
- [x] Verify the app visually reduces to just the standalone bar window.
