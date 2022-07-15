import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/storage';


if (!firebase.apps.length) {
  firebase.initializeApp({ storageBucket: 'roampdf.appspot.com' });
}

const url = decodeURI(document.location.search.split('url=')[1])

const getNextId = () => {
  let nanoid = (t = 21) => {
    let e = "", r = crypto.getRandomValues(new Uint8Array(t)); for (; t--;) {
      let n = 63 & r[t]; e += n < 36 ? n.toString(36) : n < 62 ? (n - 26).toString(36).toUpperCase() : n < 63 ? "_" : "-"
    }
    return e
  };
  return nanoid(9);
}

const App = () => {
  let iframeId = null;
  let userName = null;

  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: url,
      },
      viewer.current,
    ).then((instance) => {
      const { docViewer } = instance;
      let annotManager = docViewer.getAnnotationManager();
      

      var getPageCanvas = function (pageIndex) {
        return instance.UI.iframeWindow.document.querySelector('#pageContainer' + pageIndex + ' .canvas' + pageIndex);
      };

      instance.UI.annotationPopup.add({
        type: 'actionButton',
        label: 'C',
        onClick: () => {
          const ann = annotManager.getSelectedAnnotations()[0]
          window.parent.postMessage({
            actionType: 'copyRef',
            annotation: {
              id: ann.Id,
              textUid: ann.hi["textUid"],
              dataUid: ann.hi["dataUid"],
            }
          }, '*');
        }
      });

      instance.UI.annotationPopup.add({
        type: 'actionButton',
        label: 'O',
        onClick: () => {
          const ann = annotManager.getSelectedAnnotations()[0]
          window.parent.postMessage({
            actionType: 'openHlBlock',
            annotation: {
              id: ann.Id,
              textUid: ann.hi["textUid"],
              dataUid: ann.hi["dataUid"],
            }
          }, '*');
        }
      });

    //   instance.UI.setHeaderItems(header => {
    //     header.push({
    //       type: 'actionButton',
    //       img: 'https://img.icons8.com/material/24/000000/download--v1.png',
    //       onClick: () => {
    //         const annots = annotManager.getAnnotationsList();

    // //         const page = docViewer.getCurrentPage();
    // //   console.log("here " + page)
    // // const text = docViewer.getSelectedText(page);
    // // console.log(text)

    //         // console.log(annots)
    //         let externalAnnot = [];
    //         annots.forEach((annot) => {
    //           // console.log("current annot")
    //           // console.log(annot)
    //           // console.log(annot.getCustomData('textUid'))
    //           if (!annot.getCustomData('textUid') && annot.Subject != null) {
    //             annot.setCustomData('textUid', getNextId())
    //             annot.setCustomData('dataUid', getNextId())
    //             // console.log(annot.getContents())
    //             externalAnnot.push(annot)
    //           }
    //         });
    //         // console.log("all external " + JSON.stringify(externalAnnot))
    //         externalAnnot.forEach(async (annot) => {
    //           console.log("this is external")
    //           // console.log(annot)

    //           // console.log("page nr " + annot.getPageNumber()
    //             // + annot.getX() + annot.getY() + annot.getHeight() + annot.getWidth())
                

    //         //you need to click once on the document
    //         //then you need to get all of the small rectangles (quads?)
    //         //then you convert them using the get selected text
    //         // annotManager.selectAnnotation(annot)

    //         if(annot.Quads){
    //           annot.Quads.forEach((q) => {
    //             docViewer.select(
    //               { x: annot.getX(), y: annot.getY()+3, pageNumber: annot.getPageNumber() },
    //               {
    //                 x: annot.getX() + annot.getWidth(), y: annot.getY() +3 + annot.getHeight(),
    //                 pageNumber: annot.getPageNumber()
    //               });
  
    //           })
    //         }
    //           docViewer.select(
    //             { x: annot.getX(), y: annot.getY()+3, pageNumber: annot.getPageNumber() },
    //             {
    //               x: annot.getX() + annot.getWidth(), y: annot.getY() +3 + annot.getHeight(),
    //               pageNumber: annot.getPageNumber()
    //             });

    //           const aaa = docViewer.getSelectedText(annot.getPageNumber());
    //           console.log("here: " + aaa)

    //           // docViewer.clearSelection()


    //           // annotManager.deleteAnnotation(annot, { imported: true });
    //           // // let xfdfStrings = await annotManager.exportAnnotationCommand()
    //           // // console.log("awaited " + xfdfStrings)
    //           // annotManager.addAnnotation(annot);
    //           // // xfdfStrings = await annotManager.exportAnnotationCommand()
    //           // // console.log("awaited 2" + xfdfStrings)
    //           // annotManager.setNoteContents(annot, "here is a text")

    //           // annotManager.drawAnnotationsFromList(annot);



    //           // const xfdfStrings = await annotManager.exportAnnotations(annot)
    //           // console.log("corresponding sfdf string")
    //           // console.log(xfdfStrings)
    //           // // Handle area highlights
    //           // if (annot.Subjet == "Rectangle") {
    //           //   var pageIndex = annot.PageNumber;
    //           //   // get the canvas for the page
    //           //   var pageCanvas = getPageCanvas(pageIndex);
    //           //   var topOffset = parseFloat(pageCanvas.style.top) || 0;
    //           //   var leftOffset = parseFloat(pageCanvas.style.left) || 0;
    //           //   var zoom = docViewer.getZoomLevel() * instance.iframeWindow.utils.getCanvasMultiplier();

    //           //   var x = annot.X * zoom - leftOffset;
    //           //   var y = annot.Y * zoom - topOffset;
    //           //   var width = annot.Width * zoom;
    //           //   var height = annot.Height * zoom;

    //           //   var copyCanvas = document.createElement('canvas');
    //           //   copyCanvas.width = width;
    //           //   copyCanvas.height = height;
    //           //   var ctx = copyCanvas.getContext('2d');
    //           //   // copy the image data from the page to a new canvas so we can get the data URL
    //           //   ctx.drawImage(pageCanvas, x, y, width, height, 0, 0, width, height);
    //           //   const img = copyCanvas.toDataURL("image/png");
    //           //   annot.setCustomData('img', img)
    //           //   postxfdfString(url, annot, 'add', xfdfStrings);
    //           // } else {
    //           //   postxfdfString(url, annot, 'add', xfdfStrings);
    //           // }
    //         });

    //         //   //       annotations.forEach(annotation => {
    //         //   //         go over all annotation and if they don't have uid delete collect them
    //         //   //         then delete everything and send the collection of no-uid highlight to server 
    //         //   //         and also the clean pdf file
    //         //   //         console.log("in server: action type " + message.data.actionType)

    //         //   //   }
    //         //   // });
    //         //   //     }
    //         //   //   });
    //         // });
    //       }
    //     })
    //   })


      docViewer.addEventListener('textSelected', e => (quads, text, pageNumber) => console.log(text), false);

      window.addEventListener('message', e => handleMessage(e, annotManager), false);

      // Save when annotation change event is triggered (adding, modifying or deleting of annotations)
      annotManager.addEventListener('annotationChanged', function (annots, action, options) {
        // If the event is triggered by importing then it can be ignored
        // This will happen when importing the initial annotations from the server or individual changes from other users
        if (options.imported) return;
        console.log("in annot changed")
        // Add text and data uid to the annotation (if it is a new annotation)
        annots.forEach((annot) => {
          if (!annot.getCustomData('textUid')) {
            annot.setCustomData('textUid', getNextId())
            annot.setCustomData('dataUid', getNextId())
          }
        });
        // Export annotations to xml and post them to roam      
        annotManager.exportAnnotationCommand().then((xfdfStrings) => {
          annots.forEach((annot) => {
            // Handle area highlights
            if (annot.ToolName.startsWith("AnnotationCreateRectangle")) {
              var pageIndex = annot.PageNumber;
              // get the canvas for the page
              var pageCanvas = getPageCanvas(pageIndex);
              var topOffset = parseFloat(pageCanvas.style.top) || 0;
              var leftOffset = parseFloat(pageCanvas.style.left) || 0;
              var zoom = docViewer.getZoomLevel() * instance.iframeWindow.utils.getCanvasMultiplier();

              var x = annot.X * zoom - leftOffset;
              var y = annot.Y * zoom - topOffset;
              var width = annot.Width * zoom;
              var height = annot.Height * zoom;

              var copyCanvas = document.createElement('canvas');
              copyCanvas.width = width;
              copyCanvas.height = height;
              var ctx = copyCanvas.getContext('2d');
              // copy the image data from the page to a new canvas so we can get the data URL
              ctx.drawImage(pageCanvas, x, y, width, height, 0, 0, width, height);
              const img = copyCanvas.toDataURL("image/png");
              annot.setCustomData('img', img)
              postxfdfString(url, annot, action, xfdfStrings);
            } else {
              postxfdfString(url, annot, action, xfdfStrings);
            }
          });
        });
      });
    });
  });

  // documentViewer.addEventListener('annotationsLoaded', () => {
  //   const annots = annotationManager.getAnnotationsList();

  //   // remove annotations
  //   annotationManager.deleteAnnotations(annots);
  // });

  const rgba2hex = function (col, a) {
    if (col === undefined) return "00000000"
    let hex = (col.R | 1 << 8).toString(16).slice(1) +
      (col.G | 1 << 8).toString(16).slice(1) +
      (col.B | 1 << 8).toString(16).slice(1);
    // let a = col.A
    // multiply before convert to HEX
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + a;
    return hex;
  }

  const handleMessage = function (message, annotManager) {
    // iframeId = message.data.iframeId;
    if (!iframeId) { iframeId = message.data.iframeId; }
    if (!userName) {
      userName = message.data.userName;
      annotManager.setCurrentUser(userName);
      annotManager.promoteUserToAdmin(userName);
    }
    if (!message.data.highlights) return;
    const xfdfStrings = message.data.highlights
    // Load highlights     
    xfdfStrings.forEach(async (xfdfString) => {

      const annotations = await annotManager.importAnnotationCommand(xfdfString);
      annotations.forEach(annotation => {
        console.log("in server: action type " + message.data.actionType)
        if (message.data.actionType === "delete") {
          annotManager.deleteAnnotation(annotation);
        } if (message.data.actionType === "scrollTo") {
          annotManager.jumpToAnnotation(annotation);
        } else {
          console.log(" redraw")
          console.log(annotation)
          annotManager.redrawAnnotation(annotation);
        }
      });
    });
    return true;
  }
  // Make a POST request with document ID, annotation ID and XFDF string
  const postxfdfString = function (url, ann, action, xfdfString) {
    console.log("in server: posting annotation back")
    const hlColor = (ann.FillColor === "rgba(0,0,0,0)") ?
      null : rgba2hex(ann.FillColor || ann.Color, ann["HP"])
    console.log("We are sending: " + xfdfString + ann.hi["textUid"] + ann.hi["dataUid"])
    window.parent.postMessage({
      actionType: action,
      annotation: {
        id: ann.Id,
        textUid: ann.hi["textUid"],
        dataUid: ann.hi["dataUid"],
        author: ann.AO,
        type: ann["_xsi:type"],
        pageNumber: ann.PageNumber,
        color: hlColor,
        image: ann.hi.img,
        text: ann.hi["trn-annot-preview"],
        xfdf: xfdfString
      },
      pdfurl: encodeURI(url),
      iframeId: iframeId
    }, '*');
  };

  return (
    <div className="App">
      {/* <div className="header">React sample</div> */}
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;

