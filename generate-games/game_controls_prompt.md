Analyze the following game description and extract ALL essential controls needed to play the game, then format them as a JSON array. For keyboard controls, use "type": "keyboard" and include a "keys" array with specific key names (use "Space" for spacebar, "←→↑↓" for arrows, "Shift"/"Ctrl" for modifiers, letter keys as capitals like "W"). For mouse/touch actions, use "type": "mouse" and write clear descriptions that specify the exact action (click, drag, right-click, scroll, etc.). Each "description" should be concise but specific about what the control accomplishes in the game context. Consider movement, actions, menus, and any special mechanics mentioned. Group related keys together when they serve the same function (like WASD for movement), but separate different actions into distinct entries. Always include restart controls if mentioned. Return only the JSON array with no additional text or formatting.

Example formats:
[
  {
    "type": "keyboard",
    "keys": ["W", "A", "S", "D"],
    "description": "Move character"
  },
  {
    "type": "keyboard", 
    "keys": ["Space"],
    "description": "Jump"
  },
  {
    "type": "mouse",
    "description": "Click and drag to aim weapon"
  },
  {
    "type": "mouse",
    "description": "Right-click to open inventory"
  },
  {
    "type": "keyboard",
    "keys": ["R"],
    "description": "Restart game"
  }
]