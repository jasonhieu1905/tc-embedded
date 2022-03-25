window.addEventListener("DOMContentLoaded", ignite);
window.addEventListener("message", handleEvent, false);

const templateChooserDomain = "https://local.officeatwork365.com:9000";
const STATUS_IDLE = "idle";
const STATUS_CREATING = "creating document ...";
const STATUS_CREATED = "success";
const STATUS_ERROR = "error";

const ACTION_CREATING_DOCUMENT = "creating document";
const ACTION_CREATED_DOCUMENT = "created document";
const ACTION_RELOAD_TC = "reload template chooser";

const initialState = { status: STATUS_IDLE, fileName: "", blob: undefined };
let store;

function ignite() {
  const $template = document.querySelector("#template");
  const $uploadUrl = document.querySelector("#upload-url");
  const $status = document.querySelector("#status");
  const $resultFile = document.querySelector("#result-file");
  const $reload = document.querySelector("#reload-tc");
  const $copyUrl = document.querySelector("#copy-tc-url");

  $reload.addEventListener("click", () => {
    store.dispatch(ACTION_RELOAD_TC);
  });

  $copyUrl.addEventListener("click", () => {
    alert("copy");
  });

  $resultFile.addEventListener("click", () => {
    const { blob, fileName } = store.getState();
    saveAs(blob, fileName);
  });

  function createStore(initialState, reducer) {
    const state = new Proxy(
      { value: initialState },
      {
        set(obj, prop, value) {
          obj[prop] = value;
          updateUI();
        },
      }
    );

    function getState() {
      return { ...state.value };
    }

    function dispatch(action, payload) {
      const prevState = getState();
      state.value = reducer(prevState, action, payload);
    }

    return {
      getState,
      dispatch,
    };
  }

  function reducer(state, action, payload) {
    switch (action) {
      case ACTION_CREATING_DOCUMENT:
        state.status = STATUS_CREATING;
        state.fileName = "";
        state.blob = undefined;
        break;
      case ACTION_CREATED_DOCUMENT:
        state.status = STATUS_CREATED;
        state.fileName = payload.fileName;
        state.blob = payload.blob;
        break;
      case ACTION_RELOAD_TC:
        state.status = STATUS_IDLE;
        state.fileName = "";
        state.blob = undefined;
        break;
      default:
        state.counter = 0;
        break;
    }

    return state;
  }

  function updateUI() {
    $status.innerText = store.getState().status;
    $resultFile.innerText = store.getState().fileName;
  }

  store = createStore(initialState, reducer);
  updateUI();
}

function handleEvent(event) {
  if (event.origin !== templateChooserDomain) {
    return;
  }

  if (event.data && event.data.type === "template-chooser-blob") {
    const document = event.data.blob;

    if (!document) {
      store.dispatch(ACTION_CREATING_DOCUMENT);
      return;
    }

    const fileName = event.data.fileName;
    store.dispatch(ACTION_CREATED_DOCUMENT, { fileName, blob: document });
  }
}
