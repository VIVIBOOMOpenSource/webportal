import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import EmbeddedYoutubeLinkManipulator from "../../../js/editor/embeddedYoutubeLinkManipulator";
import ScratchOption from "../projects/project-content/wysiwyg-scratch-toolbar-option";
import { ReactComponent as NextSvg } from "../../../css/imgs/icon-arrow-forward.svg";

import "./editor-view.scss";

const EditorView = ({ loggedIn, setLoggedIn }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const submitData = () => {
    let contentObject = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({ op: "content", contentObject: contentObject }));
    } catch (err) {
      toast.error("This functionality is for the VIVIBOOM React Native App only.");
    }
  };

  useEffect(() => {
    const sendMessage = () => {
      try {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            op: "resize",
            height: document.querySelector(".editor-view-container").clientHeight,
            width: document.querySelector(".editor-view-container").clientWidth,
          })
        );
      } catch (err) {
        toast.error("This functionality is for the VIVIBOOM React Native App only.");
      }
    };

    window.addEventListener("resize", sendMessage);

    return () => window.removeEventListener("resize", sendMessage);
  }, []);

  return (
    <div className="editor-view-container">
      <div className="editor-container">
        <Editor
          editorState={editorState}
          toolbarClassName="toolbar"
          wrapperClassName={"wrapper"}
          editorClassName="editor"
          onEditorStateChange={(e) => setEditorState(e)}
          toolbar={{
            options: ["inline", "list", "colorPicker", "link", "embedded", "image", "history"],
            inline: { superscript: { icon: undefined, className: "hide" }, subscript: { icon: undefined, className: "hide" } },
            list: {
              indent: { icon: undefined, className: "hide" },
              outdent: { icon: undefined, className: "hide" },
            },
            embedded: {
              embedCallback: EmbeddedYoutubeLinkManipulator,
            },
          }}
          toolbarCustomButtons={[<ScratchOption />]}
        />
      </div>
      <div className="button-container" onClick={submitData}>
        Next
        <div className="svg-container">
          <NextSvg />
        </div>
      </div>
    </div>
  );
};

export default EditorView;
