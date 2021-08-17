
export function Reducer(state, action) {
  switch (action.type) {
    case "EMIT":
      return action.payload;
    case "NODE":
      return action.payload;

    case "HIGHLIGHT":
      return action.payload;
    default:
      return state;
  }
}