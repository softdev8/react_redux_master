import Immutable from 'immutable';

import {
   // Animation,
   // Flowchart,
   // SequenceDiagram,
   BinaryTree,
   CanvasImage,
   CanvasText,
   Chart,
   Code,
   Datagrid,
   EducativeArray,
   Equation,
   File,
   Graph,
   Graphviz,
   HashTable,
   Heading,
   Image,
   LinkedList,
   MarkdownEditor,
   SpoilerEditor,
   Matrix,
   NaryTree,
   Quiz,
   RunJS,
   SequenceDiagrams,
   Stack,
   SVG,
   SVGEdit,
   MxGraph,
   TabbedCode,
   TextEditor,
   Video,
   WebpackBin,
} from '../components/widgets';

export const defaultComponents = [
  {
  title : "Markdown",
  type  : "MarkdownEditor",
  icon  : "",
  img   : "markdown.png",
  canvasSupport: false,
  pageSupport: true,

  defaultVal: {
    type: "MarkdownEditor",
    mode: "edit",
    content: Immutable.fromJS(MarkdownEditor.getComponentDefault()),
  },

  svg_string: '<svg version=\"1.1\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\" x=\"0\" y=\"0\" width=\"120\" height=\"62.4\" viewBox=\"0, 0, 800, 416\"> <g id=\"Layer_1\" transform=\"translate(-128, -319.875)\"> <path d=\"M576,703.875 L576,319.875 L448,320 L352,448 L256,320 L128,320 L128,704 L256,704 L256,512 L352,635.077 L448,512 L448,704 L576,703.875 z\" fill=\"#2EB398\"\/> <path d=\"M767.091,735.875 L928,512 L832,512 L832,320 L704,320 L704,512 L608,512 L767.091,735.875 z\" fill=\"#2EB398\"\/> <\/g> <\/svg>',
}, {
  title: "Code",
  type: "Code",
  icon: "",
  img: "code.png",
  canvasSupport: false,
  pageSupport: true,
  allows_assessment: true,

  defaultVal: {
    type: "Code",
    mode: "edit",
    content: Immutable.fromJS(Code.getComponentDefault()),
  },
}, {
  title: "Code Tabs",
  type: "TabbedCode",
  icon: "",
  img: "multitab.png",
  canvasSupport: false,
  pageSupport: true,
  allows_assessment: true,

  defaultVal: {
    type: "TabbedCode",
    mode: "edit",
    content: Immutable.fromJS(TabbedCode.getComponentDefault()),
  },
}, {
  title: "Image",
  type: "Image",
  icon: "",
  img: "picture.png",
  disableInDemo : true,
  canvasSupport: false,
  pageSupport: true,

  defaultVal: {
    type: "Image",
    mode: "edit",
    content: Immutable.fromJS(Image.getComponentDefault()),
  },
}, {
  title: "Run JS",
  type: "RunJS",
  icon: "",
  img: "runjs.png",
  canvasSupport: false,
  pageSupport: true,
  allows_assessment: true,

  defaultVal: {
    type: "RunJS",
    mode: "edit",
    content: Immutable.fromJS(RunJS.getComponentDefault()),
  },
}, {
  title: "Animation",
  type: "CanvasAnimation",
  icon: "",
  img: "canvas-animation.png",
  canvasSupport: false,
  pageSupport: true,

  defaultVal: {
    type: "CanvasAnimation",
    mode: "edit",

    content: Immutable.fromJS({
      version: '1.0',
      width: 600,
      height: 400,
      canvasObjects: [{version: '1.0', width: 600, height: 400, objectsDict: {}, canvasJSON: '', svg_string: ''}],
    }),
  },
}, {
  title: "Chart",
  type: "Chart",
  icon: "",
  img: "chart.png",
  canvasSupport: false,
  pageSupport: true,

  defaultVal: {
    type: "Chart",
    mode: "edit",
    content: Immutable.fromJS(Chart.getComponentDefault()),
  },
},
{
    title: "Hint",
    type: "SpoilerEditor",
    icon: "",
    img: "hint.png",
    canvasSupport: false,
    pageSupport: true,

    defaultVal: {
        type: "SpoilerEditor",
        mode: "edit",
        content: Immutable.fromJS(SpoilerEditor.getComponentDefault()),
    },
}];

const allComponentsMeta = [ {
  title: "Single Page App",
  type: "WebpackBin",
  icon: "",
  img: "webpack.png",
  canvasSupport: false,
  pageSupport: true,

  defaultVal: {
    type: "WebpackBin",
    mode: "edit",
    content: Immutable.fromJS(WebpackBin.getComponentDefault()),
  },
}, {
  title: "Graph",
  type: "Graph",
  icon: "",
  img: "graph.png",
  canvasSupport: true,
  pageSupport: true,

  defaultVal: {
    type: "Graph",
    mode: "edit",
    content: Immutable.fromJS(Graph.getComponentDefault()),
  },
}, {
  title: "Matrix",
  type: "Matrix",
  icon: "",
  img: "matrix.png",
  canvasSupport: true,
  pageSupport: true,

  defaultVal: {
    type: "Matrix",
    mode: "edit",
    content: Immutable.fromJS(Matrix.getComponentDefault()),
  },
}, {
  title: "Linked List",
  type: "LinkedList",
  icon: "",
  img: "linkedlist.png",
  canvasSupport: true,
  pageSupport: true,

  defaultVal: {
    type: "LinkedList",
    mode: "edit",
    content: Immutable.fromJS(LinkedList.getComponentDefault()),
  },

  svg_string: '<svg width="104" height="38" xmlns="http://www.w3.org/2000/svg"> <g id="graph0" class="graph" transform="scale(1) translate(4,34) "> <title>%3</title> <!-- node_1 --> <path fill="#d9d9d9" stroke="#050404" stroke-width="1.5" d="m10.1667,-0.5c0,0 9.6666,0 9.6666,0c4.8334,0 9.6667,-4.83333 9.6667,-9.6667c0,0 0,-9.6666 0,-9.6666c0,-4.8334 -4.8333,-9.6667 -9.6667,-9.6667c0,0 -9.6666,0 -9.6666,0c-4.83337,0 -9.6667,4.8333 -9.6667,9.6667c0,0 0,9.6666 0,9.6666c0,4.83337 4.83333,9.6667 9.6667,9.6667" id="svg_2" fill-opacity="0.01"/> <text text-anchor="middle" x="15" y="-10.6" font-family="Courier,monospace" font-size="16" id="svg_3">1</text> <!-- node_2 --> <path fill="#d9d9d9" stroke="#000000" stroke-width="1.5" d="m76.1667,-0.5c0,0 9.6666,0 9.6666,0c4.8334,0 9.6667,-4.83333 9.6667,-9.6667c0,0 0,-9.6666 0,-9.6666c0,-4.8334 -4.8333,-9.6667 -9.6667,-9.6667c0,0 -9.6666,0 -9.6666,0c-4.8334,0 -9.6667,4.8333 -9.6667,9.6667c0,0 0,9.6666 0,9.6666c0,4.83337 4.8333,9.6667 9.6667,9.6667" id="svg_4" fill-opacity="0.01"/> <text text-anchor="middle" x="81" y="-10.6" font-family="Courier,monospace" font-size="16" id="svg_5" fill="black">2</text> <!-- node_1&#45;&gt;node_2 --> <g id="edge1" class="edge"> <title>node_1-&gt;node_2</title> <path fill="none" stroke="#404040" stroke-width="0.6" d="m29.5728,-15c8.3154,0 19.1492,0 28.6428,0" id="svg_6"/> <polygon fill="#404040" stroke="#404040" stroke-width="0.6" points="58.4468,-17.8001 66.4468,-15 58.4468,-12.2001 58.4468,-17.8001" id="svg_7"/> </g> </g> </svg>',
}, {
  title: "Array",
  type: "EducativeArray",
  icon: "",
  img: "array.png",
  canvasSupport: true,
  pageSupport: true,

  defaultVal: {
    type: "EducativeArray",
    mode: "edit",
    content: Immutable.fromJS(EducativeArray.getComponentDefault()),
  },

  svg_string: '<svg width="96" height="38" xmlns="http://www.w3.org/2000/svg"> <g id="graph0" class="graph" transform="scale(1) translate(4,34) "> <title>%3</title> <!-- node_1437698556683 --> <polygon fill-opacity="0.01" fill="#d9d9d9" stroke="#000000" stroke-width="1.5" points="-0.5,-0.5 -0.5,-29.5 28.5,-29.5 28.5,-0.5 -0.5,-0.5" id="svg_2"/> <text text-anchor="middle" x="13.7992" y="-10.2" font-family="Courier,monospace" font-size="16" id="svg_3">1</text> <!-- node_1437698556684 --> <polygon fill-opacity="0.01" fill="#d9d9d9" stroke="#000000" stroke-width="1.5" points="29.5,-0.5 29.5,-29.5 58.5,-29.5 58.5,-0.5 29.5,-0.5" id="svg_4"/> <text text-anchor="middle" x="43.7992" y="-10.2" font-family="Courier,monospace" font-size="16" id="svg_5" fill="black">2</text> <!-- node_1437698556685 --> <polygon fill-opacity="0.01" fill="#d9d9d9" stroke="#000000" stroke-width="1.5" points="59.5,-0.5 59.5,-29.5 88.5,-29.5 88.5,-0.5 59.5,-0.5" id="svg_6"/> <text text-anchor="middle" x="73.7992" y="-10.2" font-family="Courier,monospace" font-size="16" id="svg_7">3</text> </g> </svg>',
}, {
  title: "Binary Tree",
  type: "BinaryTree",
  icon: "",
  img: "binarytree.png",
  canvasSupport: true,
  pageSupport: true,

  defaultVal: {
    type: "BinaryTree",
    mode: "edit",
    content: Immutable.fromJS(BinaryTree.getComponentDefault()),
  },

  svg_string: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"> <g id="graph0" class="graph" transform="scale(1) translate(4,144) "> <title>%3</title> <!-- node_1437600789810 --> <path fill="#000000" stroke="#000000" stroke-width="1.5" d="m38.1667,-114c0,0 9.6666,0 9.6666,0c4.8334,0 9.6667,-4.833 9.6667,-9.667c0,0 0,-9.66599 0,-9.66599c0,-4.83401 -4.8333,-9.66701 -9.6667,-9.66701c0,0 -9.6666,0 -9.6666,0c-4.8334,0 -9.6667,4.83299 -9.6667,9.66701c0,0 0,9.66599 0,9.66599c0,4.834 4.8333,9.667 9.6667,9.667" id="svg_2" fill-opacity="0.01"/> <text text-anchor="middle" x="42.7992" y="-123.7" font-family="Courier,monospace" font-size="16" id="svg_3" fill="black">2</text> <!-- node_1437600789811 --> <path fill="#fcfcfc" stroke="#000000" stroke-width="1.5" d="m17.1667,-46.5c0,0 9.6666,0 9.6666,0c4.8334,0 9.6667,-4.8333 9.6667,-9.6667c0,0 0,-9.66661 0,-9.66661c0,-4.8334 -4.8333,-9.66669 -9.6667,-9.66669c0,0 -9.6666,0 -9.6666,0c-4.8334,0 -9.6667,4.8333 -9.6667,9.66669c0,0 0,9.66661 0,9.66661c0,4.8334 4.8333,9.6667 9.6667,9.6667" id="svg_4" fill-opacity="0.01"/> <text fill="black" text-anchor="middle" x="21.7992" y="-56.2" font-family="Courier,monospace" font-size="16" id="svg_5">1</text> <!-- node_1437600789810&#45;&gt;node_1437600789811 --> <g id="edge1" class="edge"> <title>node_1437600789810-&gt;node_1437600789811</title> <path fill="none" stroke="black" d="m37.1223,-113.427c-3.0494,8.485 -7.0411,19.5923 -10.5018,29.2222" id="svg_6"/> <polygon fill="black" stroke="black" points="29.211299896240234,-83.13480377197266 23.87070083618164,-76.5531997680664 23.941299438476562,-85.02880096435547 29.211299896240234,-83.13480377197266 " id="svg_7"/> </g> <!-- node_1437600789812 --> <path fill="#fcfcfc" stroke="#000000" stroke-width="1.5" d="m64.1667,-46.5c0,0 9.6666,0 9.6666,0c4.8334,0 9.6667,-4.8333 9.6667,-9.6667c0,0 0,-9.66661 0,-9.66661c0,-4.8334 -4.8333,-9.66669 -9.6667,-9.66669c0,0 -9.6666,0 -9.6666,0c-4.8334,0 -9.6667,4.8333 -9.6667,9.66669c0,0 0,9.66661 0,9.66661c0,4.8334 4.8333,9.6667 9.6667,9.6667" id="svg_8" fill-opacity="0.01"/> <text fill="black" text-anchor="middle" x="68.7992" y="-56.2" font-family="Courier,monospace" font-size="16" id="svg_9">3</text> <!-- node_1437600789810&#45;&gt;node_1437600789812 --> <g id="edge2" class="edge"> <title>node_1437600789810-&gt;node_1437600789812</title> <path fill="none" stroke="black" d="m50.5898,-113.927c3.1819,8.485 7.3472,19.5923 10.9584,29.2222" id="svg_10"/> <polygon fill="black" stroke="black" points="64.2302017211914,-85.5270004272461 64.41759872436523,-77.0531997680664 58.98680114746094,-83.56069946289062 64.2302017211914,-85.5270004272461 " id="svg_11"/> </g> <!-- node_1437600789811_left_invis --> <!-- node_1437600789811&#45;&gt;node_1437600789811_left_invis --> <!-- node_1437600789811_right_invis --> <!-- node_1437600789811&#45;&gt;node_1437600789811_right_invis --> <!-- node_1437600789812_left_invis --> <!-- node_1437600789812&#45;&gt;node_1437600789812_left_invis --> <!-- node_1437600789812_right_invis --> <!-- node_1437600789812&#45;&gt;node_1437600789812_right_invis --> </g> </svg>',
}, {
  title: "Nary Tree",
  type: "NaryTree",
  icon: "",
  img: "narytree.png",
  canvasSupport: true,
  pageSupport: true,

  defaultVal: {
    type: "NaryTree",
    mode: "edit",
    content: Immutable.fromJS(NaryTree.getDefaultNaryTreeRoot()),
  },

  svg_string: '<svg width="130" height="104" xmlns="http://www.w3.org/2000/svg"> <g id="graph0" class="graph" transform="scale(1) translate(4,100) "> <title>%3</title> <!-- node_1437697785423 --> <path fill="#d9d9d9" stroke="#000000" stroke-width="1.5" d="m56.1667,-66.5c0,0 9.6666,0 9.6666,0c4.8334,0 9.6667,-4.8333 9.6667,-9.6667c0,0 0,-9.6666 0,-9.6666c0,-4.8334 -4.8333,-9.6667 -9.6667,-9.6667c0,0 -9.6666,0 -9.6666,0c-4.8334,0 -9.6667,4.8333 -9.6667,9.6667c0,0 0,9.6666 0,9.6666c0,4.8334 4.8333,9.6667 9.6667,9.6667" id="svg_2" fill-opacity="0.01"/> <text text-anchor="middle" x="60.7992" y="-76.2" font-family="Courier,monospace" font-size="16" id="svg_3">1</text> <!-- node_1437697785424 --> <path fill="#d9d9d9" stroke="#000000" stroke-width="1.5" d="m9.16667,-0.5c0,0 9.66663,0 9.66663,0c4.8334,0 9.6667,-4.83333 9.6667,-9.6667c0,0 0,-9.6666 0,-9.6666c0,-4.8334 -4.8333,-9.6667 -9.6667,-9.6667c0,0 -9.66663,0 -9.66663,0c-4.83334,0 -9.66667,4.8333 -9.66667,9.6667c0,0 0,9.6666 0,9.6666c0,4.83337 4.83333,9.6667 9.66667,9.6667" id="svg_4" fill-opacity="0.01"/> <text text-anchor="middle" x="13.7992" y="-10.2" font-family="Courier,monospace" font-size="16" id="svg_5">2</text> <!-- node_1437697785423&#45;&gt;node_1437697785424 --> <g id="edge1" class="edge"> <title>node_1437697785423-&gt;node_1437697785424</title> <path fill="none" stroke="black" d="m51.0325,-66.4272c-6.4805,8.8245 -15.0439,20.4853 -22.3034,30.3706" id="svg_6"/> <polygon fill="black" stroke="black" points="30.9453,-34.3439 23.9531,-29.5532 26.4316,-37.6586 30.9453,-34.3439" id="svg_7"/> </g> <!-- node_1437697785425 --> <path fill="#d9d9d9" stroke="#000000" stroke-width="1.5" d="m56.1667,-0.5c0,0 9.6666,0 9.6666,0c4.8334,0 9.6667,-4.83333 9.6667,-9.6667c0,0 0,-9.6666 0,-9.6666c0,-4.8334 -4.8333,-9.6667 -9.6667,-9.6667c0,0 -9.6666,0 -9.6666,0c-4.8334,0 -9.6667,4.8333 -9.6667,9.6667c0,0 0,9.6666 0,9.6666c0,4.83337 4.8333,9.6667 9.6667,9.6667" id="svg_8" fill-opacity="0.01"/> <text text-anchor="middle" x="60.7992" y="-10.2" font-family="Courier,monospace" font-size="16" id="svg_9">3</text> <!-- node_1437697785423&#45;&gt;node_1437697785425 --> <g id="edge2" class="edge"> <title>node_1437697785423-&gt;node_1437697785425</title> <path fill="none" stroke="black" d="m61,-66.4272c0,8.3154 0,19.1492 0,28.6428" id="svg_10"/> <polygon fill="black" stroke="black" points="63.8001,-37.5532 61,-29.5532 58.2001,-37.5532 63.8001,-37.5532" id="svg_11"/> </g> <!-- node_1437697785426 --> <path fill="#d9d9d9" stroke="#000000" stroke-width="1.5" d="m103.167,-0.5c0,0 9.666,0 9.666,0c4.834,0 9.667,-4.83333 9.667,-9.6667c0,0 0,-9.6666 0,-9.6666c0,-4.8334 -4.833,-9.6667 -9.667,-9.6667c0,0 -9.666,0 -9.666,0c-4.8337,0 -9.667,4.8333 -9.667,9.6667c0,0 0,9.6666 0,9.6666c0,4.83337 4.8333,9.6667 9.667,9.6667" id="svg_12" fill-opacity="0.01"/> <text text-anchor="middle" x="107.799" y="-10.2" font-family="Courier,monospace" font-size="16" id="svg_13" fill="black">4</text> <!-- node_1437697785423&#45;&gt;node_1437697785426 --> <g id="edge3" class="edge"> <title>node_1437697785423-&gt;node_1437697785426</title> <path fill="none" stroke="black" d="m70.9675,-66.4272c6.4805,8.8245 15.0439,20.4853 22.3034,30.3706" id="svg_14"/> <polygon fill="black" stroke="black" points="95.5684,-37.6586 98.0469,-29.5532 91.0547,-34.3439 95.5684,-37.6586" id="svg_15"/> </g> </g> </svg>',
}, {
  title: "Stack",
  type: "Stack",
  icon: "",
  img: "stack.png",
  canvasSupport: true,
  pageSupport: true,

  defaultVal: {
    type: "Stack",
    mode: "edit",
    content: Immutable.fromJS(Stack.getComponentDefault()),
  },

  svg_string: '<svg width="130" height="120" xmlns="http://www.w3.org/2000/svg"> <g id="graph0" class="graph" transform="scale(1) translate(4,116) "> <title>%3</title> <!-- node_1437723297226 --> <polygon fill="#caff70" stroke="#000000" stroke-width="1.55" points="0.5,-0 0.5,-36 81.5,-36 81.5,-0 0.5,-0" id="svg_2" fill-opacity="0.01"/> <text text-anchor="middle" x="41" y="-13.6" font-family="Courier,monospace" font-size="16" id="svg_3">1</text> <!-- node_1437723297227 --> <polygon fill="#caff70" stroke="#000000" stroke-width="1.5" points="0.5,-38 0.5,-74 81.5,-74 81.5,-38 0.5,-38" id="svg_4" fill-opacity="0.01"/> <text text-anchor="middle" x="41" y="-51.6" font-family="Courier,monospace" font-size="16" id="svg_5">2</text> <!-- node_1437723297228 --> <polygon fill="#caff70" stroke="#000000" stroke-width="1.5" points="0.5,-76 0.5,-112 81.5,-112 81.5,-76 0.5,-76" id="svg_6" fill-opacity="0.01"/> <text text-anchor="middle" x="41" y="-89.6" font-family="Courier,monospace" font-size="16" id="svg_7">3</text> <!-- top_node --> <!-- node_1437723297228&#45;&gt;top_node --> <g id="edge1" class="edge"> <title>node_1437723297228-&gt;top_node</title> <path fill="none" stroke="black" d="m91.7706,-94c9.4404,0 18.8434,0 26.8054,0" id="svg_10"/> <polygon fill="black" stroke="black" points="91.5779,-90.5001 81.5779,-94 91.5778,-97.5001 91.5779,-90.5001" id="svg_11"/> </g> </g> </svg>',
}, {
  title: "Hash Table",
  type: "HashTable",
  icon: "",
  img: "hashtable.png",
  canvasSupport: true,
  pageSupport: true,

  defaultVal: {
    type: "HashTable",
    mode: "edit",
    content: Immutable.fromJS(HashTable.getComponentDefault()),
  },

  svg_string: '<svg width=\"331pt\" height=\"109pt\" viewBox=\"0.00 0.00 330.98 109.00\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\"> <g id=\"graph0\" class=\"graph\" transform=\"scale(1 1) rotate(0) translate(4 105)\"> <title>%19<\/title> <!-- node_2 --> <g id=\"node_2\" class=\"node\"><title>node_2<\/title> <polygon fill=\"#bfefff\" stroke=\"#000000\" stroke-width=\"0.42\" points=\"0,-0.5 0,-30.5 123,-30.5 123,-0.5 0,-0.5\"><\/polygon> <text text-anchor=\"middle\" x=\"61.5\" y=\"-11.1\" font-family=\"Courier,monospace\" font-size=\"16.00\">Key 3<\/text> <\/g> <!-- node_1 --> <g id=\"node_1\" class=\"node\"><title>node_1<\/title> <polygon fill=\"#bfefff\" stroke=\"#000000\" stroke-width=\"0.42\" points=\"0,-35.5 0,-65.5 123,-65.5 123,-35.5 0,-35.5\"><\/polygon> <text text-anchor=\"middle\" x=\"61.5\" y=\"-46.1\" font-family=\"Courier,monospace\" font-size=\"16.00\">Key 2<\/text> <\/g> <!-- node_1_1 --> <g id=\"node_1_1\" class=\"node\"><title>node_1_1<\/title> <path fill=\"#e6e6e6\" stroke=\"black\" stroke-width=\"0.5\" d=\"M168.067,-36.9C168.067,-36.9 213.925,-36.9 213.925,-36.9 218.459,-36.9 222.992,-41.4333 222.992,-45.9667 222.992,-45.9667 222.992,-55.0333 222.992,-55.0333 222.992,-59.5667 218.459,-64.1 213.925,-64.1 213.925,-64.1 168.067,-64.1 168.067,-64.1 163.533,-64.1 159,-59.5667 159,-55.0333 159,-55.0333 159,-45.9667 159,-45.9667 159,-41.4333 163.533,-36.9 168.067,-36.9\"><\/path> <text text-anchor=\"middle\" x=\"190.996\" y=\"-45.7\" font-family=\"Courier,monospace\" font-size=\"16.00\">Val 2<\/text> <\/g> <!-- node_1&#45;&gt;node_1_1 --> <g id=\"edge2\" class=\"edge\"><title>node_1-&gt;node_1_1<\/title> <path fill=\"none\" stroke=\"black\" d=\"M123.261,-50.5C133.651,-50.5 144.147,-50.5 153.642,-50.5\"><\/path> <polygon fill=\"black\" stroke=\"black\" points=\"153.807,-52.2501 158.807,-50.5 153.807,-48.7501 153.807,-52.2501\"><\/polygon> <\/g> <!-- node_1_2 --> <g id=\"node_1_2\" class=\"node\"><title>node_1_2<\/title> <path fill=\"#e6e6e6\" stroke=\"black\" stroke-width=\"0.5\" d=\"M268.059,-36.9C268.059,-36.9 313.917,-36.9 313.917,-36.9 318.451,-36.9 322.984,-41.4333 322.984,-45.9667 322.984,-45.9667 322.984,-55.0333 322.984,-55.0333 322.984,-59.5667 318.451,-64.1 313.917,-64.1 313.917,-64.1 268.059,-64.1 268.059,-64.1 263.525,-64.1 258.992,-59.5667 258.992,-55.0333 258.992,-55.0333 258.992,-45.9667 258.992,-45.9667 258.992,-41.4333 263.525,-36.9 268.059,-36.9\"><\/path> <text text-anchor=\"middle\" x=\"290.988\" y=\"-45.7\" font-family=\"Courier,monospace\" font-size=\"16.00\">Val 3<\/text> <\/g> <!-- node_1_1&#45;&gt;node_1_2 --> <g id=\"edge1\" class=\"edge\"><title>node_1_1-&gt;node_1_2<\/title> <path fill=\"none\" stroke=\"black\" stroke-width=\"0.6\" d=\"M223.001,-50.5C231.759,-50.5 241.407,-50.5 250.588,-50.5\"><\/path> <polygon fill=\"#404040\" stroke=\"black\" stroke-width=\"0.6\" points=\"250.848,-53.3001 258.848,-50.5 250.848,-47.7001 250.848,-53.3001\"><\/polygon> <\/g> <!-- node_0 --> <g id=\"node_0\" class=\"node\"><title>node_0<\/title> <polygon fill=\"#bfefff\" stroke=\"#000000\" stroke-width=\"0.42\" points=\"0,-70.5 0,-100.5 123,-100.5 123,-70.5 0,-70.5\"><\/polygon> <text text-anchor=\"middle\" x=\"61.5\" y=\"-81.1\" font-family=\"Courier,monospace\" font-size=\"16.00\">Key 1<\/text> <\/g> <!-- node_0_1 --> <g id=\"node_0_1\" class=\"node\"><title>node_0_1<\/title> <path fill=\"#e6e6e6\" stroke=\"black\" stroke-width=\"0.5\" d=\"M168.067,-71.9C168.067,-71.9 213.925,-71.9 213.925,-71.9 218.459,-71.9 222.992,-76.4333 222.992,-80.9667 222.992,-80.9667 222.992,-90.0333 222.992,-90.0333 222.992,-94.5667 218.459,-99.1 213.925,-99.1 213.925,-99.1 168.067,-99.1 168.067,-99.1 163.533,-99.1 159,-94.5667 159,-90.0333 159,-90.0333 159,-80.9667 159,-80.9667 159,-76.4333 163.533,-71.9 168.067,-71.9\"><\/path> <text text-anchor=\"middle\" x=\"190.996\" y=\"-80.7\" font-family=\"Courier,monospace\" font-size=\"16.00\">Val 1<\/text> <\/g> <!-- node_0&#45;&gt;node_0_1 --> <g id=\"edge3\" class=\"edge\"><title>node_0-&gt;node_0_1<\/title> <path fill=\"none\" stroke=\"black\" d=\"M123.261,-85.5C133.651,-85.5 144.147,-85.5 153.642,-85.5\"><\/path> <polygon fill=\"black\" stroke=\"black\" points=\"153.807,-87.2501 158.807,-85.5 153.807,-83.7501 153.807,-87.2501\"><\/polygon> <\/g> <\/g> <\/svg>',
}, {
  title: "Equation",
  type: "Equation",
  icon: "",
  img: "equation.png",
  canvasSupport: false,
  pageSupport: true,

  defaultVal: {
    type: "Equation",
    mode: "edit",
    content: Immutable.fromJS(Equation.getComponentDefault()),
  },
}, // Disabling the sequence diagram and flowchart for v1 product launch
// {   title:"Sequence Diagram", type:"SequenceDiagram", icon:"icon-fontello-flow-parallel", img:"", canvasSupport:false, pageSupport: true,
//     defaultVal:{ type:"SequenceDiagram", mode:"edit", content: Immutable.fromJS(SequenceDiagram.getComponentDefault()
// }
// },
// {   title:"Flowchart", type:"Flowchart", icon:"icon-fontello-flow-line", img:"", canvasSupport:false, pageSupport: true,
//     defaultVal:{ type:"Flowchart", mode:"edit", content: Immutable.fromJS(Flowchart.getComponentDefault()
// }
//},
{
  title: "Graphviz",
  type: "Graphviz",
  icon: "",
  img: "graphiz.png",
  canvasSupport: true,
  pageSupport: true,

  defaultVal: {
    type: "Graphviz",
    mode: "edit",
    content: Immutable.fromJS(Graphviz.getComponentDefault()),
  },
  svg_string: '<svg width="120" height="188" xmlns="http://www.w3.org/2000/svg"> <g transform="scale(1) translate(4,184) " class="graph" id="graph0"> <title>g</title> <!-- a --> <ellipse stroke-width="1.5" id="svg_2" ry="18" rx="27" cy="-153" cx="72" stroke="black" fill="none"/> <text id="svg_3" font-size="14" font-family="Times,serif" y="-148.8" x="72" text-anchor="middle">a</text> <!-- b --> <ellipse stroke-width="1.5" id="svg_4" ry="18" rx="27" cy="-90" cx="27" stroke="black" fill="none"/> <text fill="black" id="svg_5" font-size="14" font-family="Times,serif" y="-85.8" x="27" text-anchor="middle">b</text> <!-- a&#45;&gt;b --> <g class="edge" id="edge1"> <title>a-&gt;b</title> <path id="svg_6" d="m47.6014,-144.411c-3.115,8.07599 -6.9351,17.98 -10.436,27.05599" stroke="black" fill="none"/> <polygon id="svg_7" points="40.4045,-116.027 33.5403,-107.956 33.8735,-118.546 40.4045,-116.027" stroke="black" fill="black"/> </g> <!-- c --> <ellipse stroke-width="1.5" id="svg_8" ry="18" rx="27" cy="-26" cx="72" stroke="black" fill="none"/> <text id="svg_9" font-size="14" font-family="Times,serif" y="-21.8" x="72" text-anchor="middle">c</text> <!-- b&#45;&gt;c --> <g class="edge" id="edge2"> <title>b-&gt;c</title> <path id="svg_10" d="m33.3986,-72.411c3.115,8.07581 6.9351,17.9798 10.436,27.0563" stroke="black" fill="none"/> <polygon id="svg_11" points="47.1265,-46.5458 47.4597,-35.9562 40.5955,-44.0267 47.1265,-46.5458" stroke="black" fill="black"/> </g> <!-- c&#45;&gt;a --> <g class="edge" id="edge3"> <title transform="translate(2,2) translate(35,-2) ">c-&gt;a</title> <path id="svg_12" d="m94.6538,-36.0925c2.022,-10.339 4.327,-23.8173 5.3462,-35.9075c1.3441,-15.9434 1.3441,-20.0566 0,-36c-0.7166,-8.501 -2.0689,-17.688 -3.5116,-25.98801" stroke="black" fill="none"/> <polygon id="svg_13" points="93.03089904785156,-133.43800354003906 94.65380096435547,-143.9080047607422 99.91419982910156,-134.71099853515625 93.03089904785156,-133.43800354003906 " stroke="black" fill="black"/> </g> </g> </svg>',
}, {
  title: "Quiz",
  type: "Quiz",
  icon: "questionIcon",
  img: "",
  canvasSupport: false,
  pageSupport: true,

  defaultVal: {
    type: "Quiz",
    mode: "edit",
    content: Immutable.fromJS(Quiz.getComponentDefault()),
  },
}, {
  title: "Spreadsheet",
  type: "Datagrid",
  icon: "tableIcon",
  img: "",
  canvasSupport: false,
  pageSupport: false,

  defaultVal: {
    type: "Datagrid",
    mode: "edit",
    content: Immutable.fromJS(Datagrid.getComponentDefault()),
  },
}, {
  title: "Freehand",
  type: "SVGEdit",
  icon: "paintBrushIcon",
  img: "",
  canvasSupport: false,
  pageSupport: true,

  defaultVal: {
    type: "SVGEdit",
    mode: "edit",
    content: Immutable.fromJS(SVGEdit.getComponentDefault()),
  },
}, {
  //SVGEditNonModal is not returning Immutable structure. This is done to avoid immutable -> mutable conversion inside canvas control
  title: "Freehand",

  type: "SVG",
  icon: "paintBrushIcon",
  img: "",
  canvasSupport: true,
  pageSupport: false,

  defaultVal: {
    type: "SVG",
    mode: "edit",
    content: SVG.getComponentDefault(),
  },
}, {
  title: "Drawing",
  type: "MxGraph",
  icon: "",
  img: "drawing.png",
  canvasSupport: false,
  pageSupport: true,

  defaultVal: {
    type: "MxGraph",
    mode: "edit",
    content: Immutable.fromJS(MxGraph.getComponentDefault()),
  },
}, {
  title: "Text",
  type: "CanvasText",
  icon: "fontIcon",
  img: "",
  canvasSupport: true,
  pageSupport: false,

  defaultVal: {
    type: "CanvasText",
    mode: "edit",
    content: Immutable.fromJS(CanvasText.getComponentDefault()),
  },
}, {
  title: "Image",
  type: "CanvasImage",
  icon: "",
  img: "picture.png",
  canvasSupport: true,
  pageSupport: false,

  defaultVal: {
    type: "CanvasImage",
    mode: "edit",
    content: Immutable.fromJS(CanvasImage.getComponentDefault()),
  },
}, {
  title: "Text",
  type: "TextEditor",
  icon: "",
  img: "text.png",
  canvasSupport: false,
  pageSupport: true,

  defaultVal: {
    type: "TextEditor",
    mode: "edit",
    content: Immutable.fromJS(TextEditor.getComponentDefault()),
  },
}, {
  title: "Heading",
  type: "Heading",
  icon: "",
  img: "heading.png",
  canvasSupport: false,
  pageSupport: false,

  defaultVal: {
    type: "Heading",
    mode: "edit",
    content: Immutable.fromJS(Heading.getComponentDefault()),
  },
}, {
  title: "File",
  type: "File",
  icon: "",
  img: "file.png",
  canvasSupport: false,
  pageSupport: true,
  defaultVal: {
    type: "File",
    mode: "edit",
    content: Immutable.fromJS(File.getComponentDefault())
  },
}, {
  title: "Video",
  type: "Video",
  icon: "",
  img: "video.png",
  canvasSupport: false,
  pageSupport: true,

  defaultVal: {
    type: "Video",
    mode: "edit",
    content: Immutable.fromJS(Video.getComponentDefault()),
  },
}, {
  title : 'Import MD',
  type  : 'MarkdownPaste',
  img   : 'markdownImport.png',
  canvasSupport: false,
  pageSupport: true,
}, {
        title: "Sequence Diagram",
        type: "SequenceDiagrams",
        icon: "",
        img: "sequence_diagram.png",
        canvasSupport: true,
        pageSupport: true,

        defaultVal: {
            type: "SequenceDiagrams",
            mode: "edit",
            content: Immutable.fromJS(SequenceDiagrams.getComponentDefault()),
        },
    },
];

export const allComponents = defaultComponents.concat(allComponentsMeta);
