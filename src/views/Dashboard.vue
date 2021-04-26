<template>
    <el-card class="introduce">
        <div class="order">
            <el-card class="order-item">
                <template #header>
                    <div class="card-header">
                        <span>今日订单数</span>
                    </div>
                </template>
                <div class="item">1888</div>
            </el-card>
            <el-card class="order-item">
                <template #header>
                    <div class="card-header">
                        <span>今日活跃</span>
                    </div>
                </template>
                <div class="item">46150</div>
            </el-card>
            <el-card class="order-item">
                <template #header>
                    <div class="card-header">
                        <span>转化率</span>
                    </div>
                </template>
                <div class="item">21%</div>
            </el-card>
        </div>
        <div id="zoom"></div>
    </el-card>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
let myChart = null//如果定义在onMounted里面，onUnmounted里销毁就要重新获取该dom
export default {
    name: 'Dashboard',
    setup(){
        onMounted(() => {
      
            var chartDom = document.getElementById('zoom');
            myChart = echarts.init(chartDom);
            var option;

            option = {
                title: {
                    text: '堆叠区域图'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['新增注册', '付费用户', '活跃用户', '订单数', '总收入']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['2021-04-01', '2021-04-02', '2021-04-03', '2021-04-04', '2021-04-05', '2021-04-06', '2021-04-07']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        emphasis: {
                            focus: 'series'
                        },
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        emphasis: {
                            focus: 'series'
                        },
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        emphasis: {
                            focus: 'series'
                        },
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        emphasis: {
                            focus: 'series'
                        },
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        areaStyle: {},
                        emphasis: {
                            focus: 'series'
                        },
                        data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            };

            option && myChart.setOption(option);
        })

        onUnmounted(() => {
            myChart.dispose()
        })

    }
}
</script>

<style scoped>
  .introduce .order {
    display: flex;
    margin-bottom: 50px;
  }
  .introduce .order .order-item {
    flex: 1;
    margin-right: 20px;
  }
  .introduce .order .order-item:last-child{
    margin-right: 0;
  }
  #zoom {
    min-height: 300px;
  }
</style>