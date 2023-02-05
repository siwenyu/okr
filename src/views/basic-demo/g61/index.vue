<template>
  <div>
    <div id="container">111</div> 
  </div>
</template>

<script setup>
// 获取store和router
import G6 from '@antv/g6';
import { Graph } from "@antv/x6";
import insertCss from 'insert-css';
import Block from './components/block.vue';
import '@antv/x6-vue-shape'
import iconPlus from './plus-circle-fill.png';
import iconLeft from './left-circle.png';
import iconBig from './big.png';
import iconSmall from './small.png';
import iconDirctionX from './dirctionx.png';
import iconDirctionY from './dirctiony.png';


insertCss(`
  .tool {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    top: -0px;
    left: -0px;
    list-style: none;
    margin: 5px 0 0 5px;
    padding: 0;
  }
  .tool > li {
    margin-top: 5px;
    margin-bottom: 5px;
    list-style: none;
  }
  .tool img {
      width: 24px;
      height: 24px;
    }
`);

import checked01 from './check01.png';
import checked02 from './check02.png';
import qizhi01 from './qizhi.png';

onMounted(() => {
  draw()
})

// 默认布局属性
const defaultLayout = {
  type: 'compactBox',
  direction: 'LR',
}

// 间距
const layoutConfigMap = {
  TB: {
    X: 60,
    Y: 12,
    W: 0,
    H: 10
  },
  LR: {
    X: 40,
    Y: 12,
    W: 12,
    H: 12,
  }
}

const sourceData = {
  id: 'root',
  label: '目标1',
  subLabel: '3,283.456',
  ratio: 3,
  children: [{
    id: 'child-a',
    label: '成果1成果1成果1成果1成果1成果1成果1成果1成果1',
    subLabel: '9%',
    ratio: 1,
    increase: true,
  }, {
    id: 'child-b',
    label: '2121',
    subLabel: '1,789,567',
    ratio: 23,
    increase: true,
    children: [{
      id: 'child-b-a',
      label: '任务1任务1任务1任务1任务1',
      subLabel: '2,385,124',
      ratio: 17,
      increase: true,
      operator: '-',
      index: 0,
      dataType: 'source',
    }
    , {
      id: 'child-b-b',
      label: '任务2',
      subLabel: '595,557',
      ratio: 12,
      increase: true,
      index: 1,
      dataType: 'source',
    }
    , {
      id: 'child-b-c',
      label: '任务2',
      subLabel: '595,557',
      ratio: 12,
      increase: true,
      index: 2,
      dataType: 'source',
    }
    ]
  }, {
    id: 'child-c',
    label: '成果3',
    subLabel: '7',
    ratio: 23,
    increase: false,
  }
  ]
};

const dealData = {
  id: 'root',
  label: '目标1',
  subLabel: '3,283.456',
  ratio: 3,
  children: [{
    id: 'child-a',
    label: '成果1成果1成果1成果1成果1成果1成果1成果1成果1',
    subLabel: '9%',
    ratio: 1,
    increase: true,
  }, {
    id: 'child-b',
    label: '2121',
    subLabel: '1,789,567',
    ratio: 23,
    increase: true,
  }, {
    id: 'child-c',
    label: '成果3',
    subLabel: '7',
    ratio: 23,
    increase: false,
  }
  ]
};




// 超过文本截取
const fittingString = (str, maxWidth, fontSize) => {
    const ellipsis = '...';
    const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
    let currentWidth = 0;
    let res = str;
    const pattern = new RegExp('[\u4E00-\u9FA5]+'); // distinguish the Chinese charactors and letters
    str.split('').forEach((letter, i) => {
        if (currentWidth > maxWidth - ellipsisLength) return;
        if (pattern.test(letter)) {
            // Chinese charactors
            currentWidth += fontSize;
        } else {
            // get the width of single letter according to the fontSize
            currentWidth += G6.Util.getLetterWidth(letter, fontSize);
        }
        if (currentWidth > maxWidth - ellipsisLength) {
            res = `${str.slice(0, Math.max(0, i))}${ellipsis}`;
        }
    });
    return res;
};
// 三种颜色
const typeColor = {
  1: '#FB5779',
  2: '#65A6F7',
  3: '#FEA028',
}

// 获取文本长度
const getTextSize = (str, maxWidth, fontSize) => {
  const width = G6.Util.getTextSize(str, fontSize)[0];
  return width > maxWidth ? maxWidth : width;
}

// 增加子节点icon
const getAddChildIcon = (group, x, y) => {
  // 增加子节点
  const node = group.addShape('image', {
    attrs: {
      x: x || 20,
      y: y || -2.5,
      width: 5,
      height: 5,
      img: iconPlus,
      cursor: 'pointer',
    },
    name: 'add-child-icon',
  });
  return node;
}

// 收起子节点
const getPackChildIcon = (group, id) => {
  // 增加子节点
  const node = group.addShape('image', {
    attrs: {
      x: 40,
      y: -2.5,
      width: 5,
      height: 5,
      img: iconLeft,
      cursor: 'pointer',
    },
    id,
    name: 'pack-child-icon',
  });
  return node;
}

// 子节点数量
const getChildCount = (group, num) => {
  const node = group.addShape('circle', {
    attrs: {
      x: 50,
      y: -1,
      r: 7,
      cursor: 'pointer',
      stroke: '#BBBBBB',
    },
    name: 'count-child-circle',
  });
  const text = group.addShape('text', {
    attrs: {
      text: `${num}`,
      x: 50,
      y: -1,
      fontSize: 8,
      fill: '#000',
      cursor: 'pointer',
      textAlign: 'center',
      textBaseline: 'middle',
    },
    name: 'count-child-text', 
  });
  const line = group.addShape('path', {
    attrs: {
      path: [
        ['M', 32, 0],
        ['L', 43, 0],
      ],
      stroke: '#BBB',
      cursor: 'pointer',
      textAlign: 'center',
      textBaseline: 'middle',
    },
    name: 'count-child-icon',
  });
  return node;
}

const draw = () => {

// 目标
G6.registerNode('root', {
  draw: (cfg, group) => {
    const size = [36, 14];
    // 节点
    const keyShape = group.addShape('rect', {
      attrs: {
        width: size[0],
        minHeight: size[1],
        height: size[1],
        x: -size[0] / 2,
        y: -size[1] / 2,
        fill: '#67CDAE',
        radius: 1,
        maxWidth: size[0],
      },
      name: 'root'
    });
    // 文字
    group.addShape('text', {
      attrs: {
        text: fittingString(cfg.label, size[0], 4),
        fill: '#000',
        fontSize: 4,
        textAlign: 'center',
        textBaseline: 'middle',
        fontWeight: 'bold',
      },
      draggable: true,
      name: 'ratio-shape'
    });
    // 添加子节点按钮
    const addChildIcon = getAddChildIcon(group);
    return keyShape;
  }
});

// 成果
G6.registerNode('level1', {
  draw: (cfg, group) => {
    const {
      collapsed,
      dataType,
    } = cfg;
    const size = [64, 10]
    // 节点
    const keyShape = group.addShape('rect', {
      attrs: {
        width: size[0],
        height: size[1],
        x: -size[0] / 2,
        y: -size[1] / 2,
        fill: dataType === 'current' ? '#A9A9A9' : '#FEA028',
        radius: 1
      },
      draggable: true,
      name: 'level1'
    });
    // 添加子节点按钮
    const addChildIcon = getAddChildIcon(group, 34);
    addChildIcon.hide();

    // 文字
    group.addShape('text', {
      attrs: {
        text: `${cfg.label}`, 
        fill: '#000',
        fontSize: 4,
        textAlign: 'center',
        textBaseline: 'middle',
      },
      draggable: true,
      name: 'label-shape',
    });

    // 收起状态并且有孩子节点，显示孩子数量，
    // 收起状态无孩子节点，无显示
    // 展开状态，显示收起按钮
    if (cfg.children?.length > 0) {
      if(collapsed) {
        getChildCount(group, cfg.children?.length);
      } else {
        addChildIcon.show();
        getPackChildIcon(group, cfg.id);
      }
    }
    return keyShape;
  },
  update: undefined,
}, 'rect')


// 叶子节点
G6.registerNode('level2', {
  draw: (cfg, group) => {
    console.log(group);
    console.log(cfg); 
    const { index, dataType } = cfg;
    const direction = graph.cfg.layout.direction;
    // 间距
    // 名字最大宽度
    const maxLabelWidth = 50
    const xStatus = 3;
    const xCheckedStatus = 12;
    const xName = getTextSize(cfg.label, maxLabelWidth, 6) + 2;
    const xChildTask = 20;
    const xMarked = 12;
    const xTime = 54;
    const xPeople = 12;
    // 节点大小
    const size = [160, 14];
    const sizeTb = [100, 30];
    if (direction === 'TB') {
      const keyShape = group.addShape('rect', {
        attrs: {
          width: 100,
          height: 30,
          // x: 0 - (index + 1) * layoutConfigMap.TB.W  - index * layoutConfigMap.TB.X,
          x: 0,
          y: sizeTb[1] * 2 * index, 
          fill: '#fff',
          radius: 1,
          stroke: '#65A6F7',
          lineWidth: 1,
        },
        name: 'level2-rect'
      });
      return keyShape;
    } else {
      const xTop = direction === 'TB' ? 28 * index : 0;
      let xLeft = 0; 
      const xLeftBase = direction === 'TB' ? -(xStatus + xCheckedStatus + xName + xChildTask + xMarked + xTime + xPeople) * index : 0;
      
      const keyShape = group.addShape('rect', {
        attrs: {
          width: size[0],
          height: size[1],
          x: xLeftBase + xLeft + 0,
          y: xTop-size[1] / 2,
          fill: '#fff',
          radius: 1,
          stroke: '#65A6F7',
          lineWidth: 1,
        },
        draggable: true,
        name: 'level2-rect'
      });
      
      // 任务状态
      const overStatus = group.addShape('rect', {
        attrs: {
          width: 2,
          height: size[1],
          x: xLeft - 1,
          y: xTop - size[1] / 2,
          fill: typeColor[1],
          radius: [1,0,0,1],
          stroke: '#65A6F7',
          lineWidth: 0,
        },
        draggable: true,
        name: 'task-status-before',
      });
      xLeft += xStatus;

      // 任务完成情况
      const checkedStatus = group.addShape('image', {
        attrs: {
          x: xLeft,
          y: xTop - 5,
          width: 10,
          height: 10,
          img: checked01,
          cursor: 'pointer',
        },
        draggable: true,
        name: 'task-status'
      });
      xLeft += xCheckedStatus;

      // 名称
      group.addShape('text', {
        attrs: {
          text: fittingString(cfg.label, maxLabelWidth, 6),
          fill: '#000',
          fontSize: 6,
          x: xLeft,
          y: xTop + 0,
          textAlign: 'left',
          textBaseline: 'middle'
        },
        draggable: true,
        name: 'task-label'
      });
      xLeft += xName;

      // 子任务
      // 计算长度
      const childCheckedStatus = group.addShape('image', {
        attrs: {
          x: xLeft,
          y: xTop - 4.5,
          width: 9,
          height: 9,
          img: checked02,
          cursor: 'pointer',
        },
        draggable: true,
        name: 'level1node-keyshape'
      });
      group.addShape('text', {
        attrs: {
          text: `1/2`,
          fill: '#000',
          fontSize: 6,
          x: xLeft + 10,
          y: xTop + 0,
          textAlign: 'left',
          textBaseline: 'middle'
        },
        draggable: true,
        name: 'child-over-status'
      });

      // 增加距离
      xLeft += xChildTask;

      // 是否标记
      const isMarked = group.addShape('image', {
        attrs: {
          x: xLeft,
          y: xTop - 5,
          width: 10,
          height: 10,
          img: qizhi01,
          cursor: 'pointer',
        },
        draggable: true,
        name: 'task-marked'
      });

      xLeft += xMarked;

      // 时间
      group.addShape('text', {
        attrs: {
          text: `2022.01 ~ 12-24`,
          fill: '#000',
          fontSize: 6,
          x: xLeft,
          y: xTop + 0,
          textAlign: 'left',
          textBaseline: 'middle',
        },
        draggable: true,
        name: 'child-over-status'
      });

      xLeft += xTime;
      // 负责人
      group.addShape('circle', {
        attrs: {
          text: `汪`,
          fill: '#BD8DE8',
          fontSize: 6,
          x: xLeft,
          y: xTop + 0,
          r: 5,
          textAlign: 'center',
          textBaseline: 'middle',
          stroke: '#BBBBBB',
          lineWidth: 0.5,
        },
        draggable: true,
        name: 'people-circle'
      });
      group.addShape('text', {
        attrs: {
          text: `汪`,
          fill: '#fff',
          fontSize: 6,
          x: xLeft,
          y: xTop + 0,
          textAlign: 'center',
          textBaseline: 'middle',
        },
        draggable: true,
        name: 'people-circle'
      });
      return keyShape;
    }
  },
  afterDraw(cfg, group) {
  },
}, 'rect')

// edge
G6.registerEdge('round-poly', {
  // getControlPoints(cfg) {
  //   let controlPoints = cfg.controlPoints; // 指定controlPoints
  //   if (!controlPoints || !controlPoints.length) {
  //     const { startPoint, endPoint, sourceNode, targetNode } = cfg;
  //     const { x: startX, y: startY, coefficientX, coefficientY } = sourceNode
  //       ? sourceNode.getModel()
  //       : startPoint;
  //     const { x: endX, y: endY } = targetNode ? targetNode.getModel() : endPoint;
  //     let curveStart = (endX - startX) * coefficientX;
  //     let curveEnd = (endY - startY) * coefficientY;
  //     curveStart = curveStart > 40 ? 40 : curveStart;
  //     curveEnd = curveEnd < -30 ? curveEnd : -30;
  //     controlPoints = [
  //       { x: startPoint.x + curveStart, y: startPoint.y },
  //       { x: endPoint.x + curveEnd, y: endPoint.y },
  //     ];
  //   }
  //   return controlPoints;
  // },
  // getPath(points) {
  //   const startPoint = points[0];
  //   const endPoint = points[3];
  //   const path = [
  //     ['M', startPoint.x , startPoint.y],
  //     ['L', (startPoint.x + endPoint.x) / 2 , startPoint.y],
  //     ['L', (startPoint.x + endPoint.x) / 2 , endPoint.y ],
  //     ['L', endPoint.x, endPoint.y],
  //   ];
    
  //   return path;
  // },
  getControlPoints: (cfg) => {
    const { startPoint, endPoint, source } = cfg;
    
    const direction = graph.cfg.layout.direction;

    if (direction === 'TB') {
      if (source === 'root') {
        return [
          {
            x: startPoint.x,
            y: startPoint.y,
          },
          
          {
            x: startPoint.x,
            y: endPoint.y - 20
          },
          {
            x: endPoint.x,
            y: endPoint.y - 20
          },
          endPoint
        ];
      } else {
        return [
          {
            x: startPoint.x,
            y: startPoint.y,
          },
          
          {
            x: startPoint.x,
            y: endPoint.y - 20
          },
          {
            x: endPoint.x,
            y: endPoint.y - 20
          },
          endPoint
        ];
      }
      
    } else {
      const offset = source === 'root' ? 30 : 60;
      return [
        {
          x: startPoint.x,
          y: startPoint.y,
        },
        {
          x: startPoint.x + offset,
          y: startPoint.y,
        },
        {
          x: startPoint.x + offset,
          y: endPoint.y
        },
        endPoint
      ];
    }
    
  },
  
}, 'single-line')


G6.Util.traverseTree(sourceData, subtree => {
  if (subtree.level === undefined) subtree.level = 0;
  subtree.children?.forEach(child => child.level = subtree.level + 1);
  switch (subtree.level) {
    case 0:
      subtree.type = 'root';
      break;
    case 1:
      subtree.type = 'level1';
      break;
    default:
      subtree.type ='level2';
  }
});

// 工具栏


const toolbar = new G6.ToolBar({
  getContent: () => {
    const outDiv = document.createElement('div');
    outDiv.style.height = '160px';
    outDiv.style.width = '46px';
    outDiv.style.top = '20px';
    outDiv.style.left = '20px';
    outDiv.style.border = '1px solid #ccc';
    outDiv.style.boxShadow = '0 0 5px 0px #bbb';
    outDiv.innerHTML = `<ul class="tool">
      <li code="big"><img src="${iconBig}" /></li>
      <li code="small"><img src="${iconSmall}" /></li>
      <li code="dx"><img src="${iconDirctionX}" /></li>
      <li code="dy"><img src="${iconDirctionY}" /></li>
    </ul>`
    return outDiv
  },
  handleClick: (code, graph) => {
    const zoom = graph.getZoom();
    if (code === 'big') {
      if (zoom > 10) return;
      graph.zoomTo(zoom + 0.3);
    } else if (code === 'small') {
      if (zoom < 1) return;
      graph.zoomTo(zoom - 0.3);
    } else if (code === 'dy') {
      const layoutDirction = 'TB';
      const config = layoutDirction === 'TB' ? layoutConfigMap.TB : layoutConfigMap.LR;
      graph.changeLayout({
        ...defaultLayout,
        type: 'compactBox',
        direction: layoutDirction,
        getHGap: function getHGap(item, item2) {
          return config.X;
        },
        getVGap: function getVGap() {
          return config.Y;
        },
        getWidth: function getWidth(cfg) {
          return config.W;
        },
        getHeight: function getHeight() {
          return config.H;
        },
        getSide () {
          return 'left';
        }
      });
      graph.fitView();
      graph.render();
    } else if (code === 'dx') { 
      graph.changeLayout({
        ...defaultLayout,
        type: 'compactBox',
        direction: 'LR',
        getHGap: function getHGap(item, item2) {
          const direction = graph.cfg.layout.direction;
          return 40;
        },
        getVGap: function getVGap() {
          const direction = graph.cfg.layout.direction;
          return direction === 'TB' ? 60 : 10;
        },
        getWidth: function getWidth(cfg) {
          const direction = graph.cfg.layout.direction;
          return direction === 'TB' ? 60 : 10;
        },
        getHeight: function getHeight() {
          const direction = graph.cfg.layout.direction;
          return direction === 'TB' ? 60 : 10;
        },
        getSide: (node) => {
          const direction = graph.cfg.layout.direction;
          return direction === 'TB' ? 'left' : 'right';
        }
      });
      graph.fitView();
      graph.render();
    }
    
  }
});
const width = 1000;
const height = 1000;
const layoutDirction = 'TB';
// const layoutDirction = 'LR';
const config = layoutDirction === 'TB' ? layoutConfigMap.TB : layoutConfigMap.LR;
const graph = new G6.TreeGraph({
  container: 'container',
  width,
  height,
  fitView: true,
  plugins: [toolbar],
  layout: {
    ...defaultLayout,
    direction: layoutDirction,
    nodeSep: 0,
    // direction: 'TB',
    getHGap: function getHGap(item, item2) {
      console.log(item);
      if (item.depth === 2) {
        if (item.index === 0) {
          return 10;
        }
        return 10;
      }
      return config.X; 
    },
    getVGap: function getVGap() {
      return config.Y;
    },
    getWidth: function getWidth(cfg) {
      return config.W;
    },
    getHeight: function getHeight() {
      return config.H;
    },
    getSide () {
      return 'left'
    }
  },
  defaultEdge: {
    type: 'round-poly',
    sourceAnchor: 0,
    targetAnchor: 1,
    style: {
      radius: 8,
      stroke: 'rgb(19, 33, 92)'
    }
  },
  defaultNode: {
    anchorPoints: [
      [0.5, 0.5],
    ]
  },
  nodeStateStyles: {
    // hover: {
    //   fill: '#fff',
    //   shadowBlur: 30,
    //   shadowColor: '#ddd',
    // },
    // selected: {
    //   stroke: 'none',
    //   lineWidth: 0,
    //   fill: '#fff',
    // }
    
    // operatorhover: {
    //   'operator-box': {
    //     opacity: 1
    //   }
    // }
  },
  modes: {
    default: [
      'zoom-canvas', 
      'drag-canvas', 
      'click-node', 
      'hover-node'
    ]
  }
});



// hover事件注册
G6.registerBehavior('hover-node', {
  getEvents() {
    return {
      'node:mouseover': 'onNodeMouseOver',
      'node:mouseleave': 'onNodeMouseLeave',
      'node:mouseenter': 'onNodeMouseEnter'
    };
  },
  onNodeMouseEnter() {

  },
  onNodeMouseOver(ev) {
    const { item } = ev;
    const group = item.getContainer();
    const addChildIcon = group.find(e => e.get('name') === 'add-child-icon');
    // if (addChildIcon) {
    //   addChildIcon.show();
    // }

  },
  onNodeMouseLeave(ev) {
    const { item } = ev;
    const group = item.getContainer();
    // const addChildIcon = group.find(e => e.get('name') === 'add-child-icon');
    // if (addChildIcon) {
    //   addChildIcon.hide();
    // }
  }
})

// // 点击事件注册
G6.registerBehavior('click-node', {
  getEvents() {
    return {
      'node:click': 'onNodeClick',
      // 'canvas:click': 'onCanvasClick'
    };
  },
  onNodeClick(e) {
    const { item, target } = e;
    const {cfg} = target;
    const shapeName = cfg.name;
    const model = item.getModel();
    const direction = graph.cfg.layout.direction;

    // 图形组
    const group = item.getContainer();

    // 点击选框，出现加号，前两级
    if (shapeName === 'root' || shapeName === 'level1') {
      const addChildIcon = group.find(e => e.get('name') === 'add-child-icon');
      if (addChildIcon) { 
        !(model.collapsed === true) && addChildIcon.show();
      }
    }

    // 点击增加节点
    if (shapeName === 'add-child-icon') {
      const data = this.graph.findDataById(item.getID());
      if (!data.children) data.children = [];
      data.children.push({ 
        id: `node-${Math.random()}`,
        label: item._cfg.id === 'root' ? '分类标题' : '任务名称',
        branchColor: data.branchColor,
        type: item._cfg.id === 'root' ? 'level1' : 'level2',
        dataType: 'current',
        index: data.children?.length || 0
      });
      this.graph.updateChildren(data.children, data.id)
      return;
    }

    // 点击收起
    if (shapeName === 'pack-child-icon') {
      const updatedCollapsed = !model.collapsed;
      this.graph.updateItem(item, { collapsed: true });
      this.graph.layout();
      return;  
    } 

    // 展开
    if (shapeName === 'count-child-circle' || shapeName === 'count-child-text') { 
      const model = item.getModel(); 
      const updatedCollapsed = !model.collapsed;
      this.graph.updateItem(item, { collapsed: false });
      this.graph.layout();
      return;
    }
    
    return;
  },
})





graph.data(sourceData);
graph.render();


const renderTbLevel2 = () => {
  setTimeout(()=> {
    // 增加二级节点
    sourceData.children?.forEach(kr => {
      console.log(kr);
      console.log(graph);
      // 每一个level1
      kr.children?.forEach(item => {
        console.log(item);
        const data = graph.findDataById(kr.id);
        console.log(data.children?.length);
        if (!data.children) data.children = [];
        data.children.push({ 
          id: `node-${Math.random()}`,
          label: item.label,
          branchColor: data.branchColor,
          type: 'level2',
          dataType: 'current',
          index: data.children?.length || 0
        });
        graph.updateChildren(data.children, kr.id);
      })
    })
  }, 0);
}

  // renderTbLevel2(); 
}





const props = defineProps({
  name: {
    require: true,
    default: 'fai',
    type: String
  }
})
const state = reactive({
  levelList: null
})

const routes = computed(() => 'value')
watch(
  () => props.name,
  (oldValue, newValue) => {},
  { immediate: true }
)

const router = useRouter()
onMounted(() => {
  console.log('页面挂载了')
})
const helloFunc = () => {
  console.log('helloFunc')
}
// 导出给父元素使用
defineExpose({ helloFunc })
// 导出属性到页面中使用
const { levelList } = toRefs(state)
</script>

<style scoped lang="scss">
#toolbarContainer {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
