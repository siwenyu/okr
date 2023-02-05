<template>
  <div>
    G6
    <hr />
    <div id="container">111</div> 
  </div>
</template>

<script setup>
// 获取store和router
import { Graph} from "@antv/x6";
import Block from './components/block.vue';
import { getTeleport, register } from "@antv/x6-vue-shape";
register({
    shape: "custom-vue-node",
    width: 100,
    height: 100,
    component: Block,
  });

onMounted(() => {
  const graph = new Graph({
    container: document.querySelector("#container"),
    width: 800,
    height: 600,
    background: {
      color: "#F2F7FA",
    },
  });
  const data = {
    nodes: [
      {
        id: 'node1',
        shape: 'custom-vue-node',
        x: 100,
        y: 100,
        width: 100,
        height: 20,
        label: 'hello',
        attrs: {
          // body 是选择器名称，选中的是 rect 元素
          body: {
            stroke: 'blue',
            strokeWidth: 1,
            fill: '#ccc',
            rx: 3,
            ry: 6,
          },
        },
      },
      {
        id: 'node2',
        shape: 'rect',
        x: 200,
        y: 100,
        width: 100,
        height: 20,
        label: 'hello',
        attrs: {
          // body 是选择器名称，选中的是 rect 元素
          body: {
            stroke: 'blue',
            strokeWidth: 1,
            fill: '#ccc',
            rx: 3,
            ry: 6,
          },
        },
      },
      {
        id: 'node3',
        shape: 'rect',
        x: 300,
        y: 100,
        width: 100,
        height: 20,
        label: 'hello',
        attrs: {
          // body 是选择器名称，选中的是 rect 元素
          body: {
            stroke: 'blue',
            strokeWidth: 1,
            fill: '#ccc',
            rx: 3,
            ry: 6,
          },
        },
      }
    ],
    edges: [
      {
        shape: 'edge',
        source: 'node1',
        target: '',
        label: 'x6',
        attrs: {
          // line 是选择器名称，选中的边的 path 元素
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      }
    ]
  }
  graph.fromJSON(data)
  graph.centerContent()
})



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

<style scoped lang="scss"></style>
