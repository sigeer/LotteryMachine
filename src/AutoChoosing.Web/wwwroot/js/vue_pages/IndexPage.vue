<template>
    <div class="s-control">
        <div class="row margin-bottom-20">
            <span class="col-2">选择模式</span>
            <div class="col-6">
                <select class="form-control input-group-sm" v-model="nowKey">
                    <option v-for="x in dataRef.dataSource" :value="x.key">
                        {{ x.name }}
                    </option>
                </select>
            </div>
            <button class="btn btn-outline-info btn-sm col-auto" @click="showAddModal">添加</button>
        </div>
    </div>

    <div class="row margin-bottom-20" v-if="nowKey">
        <button class="btn btn-outline-info" @click="run">随机</button>
    </div>

    <div class="s-content row">

        <div class="s-body">
            <div v-for="x in nowSetting.items" :class="['s-item', resultKey === x.key ? 's-item-selected' : '']">
                {{x.name}}（{{x.rate * 100}}%）
                <svg  v-if="resultKey === x.key" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                </svg>
            </div>
        </div>

    </div>
</template>

<script>
    import { Machine } from './../models/Machine';
    const Source = [
        {
            name: "是/否",
            items: [{
                name: "是",
                rate: 0.5
            }, {
                name: "否",
                rate: 0.5
            }]
        },
        {
            name: "大/小",
            items: [{
                name: "大",
                rate: 0.5
            }, {
                name: "小",
                rate: 0.5
            }]
        },
        {
            name: "成功/失败",
            items: [{
                name: "成功",
                rate: 0.1
            }, {
                name: "失败",
                rate: 0.9
            }]
        }
    ];
    export default {
        setup() {
            const dataRef = Vue.reactive({
                dataSource: Source.map(x => new Machine(x))
            });

            const showAddModal = () => {

            }
            const resultKey = Vue.ref(0);
            const nowKey = Vue.ref(0);
            const nowSetting = Vue.computed(() => {
                return dataRef.dataSource.find(x => x.key === Vue.unref(nowKey)) ?? new Machine();
            });

            const run = () => {
                const item = Vue.unref(nowSetting).run();
                resultKey.value = item.key;
            }

            return {
                nowKey,
                nowSetting,

                resultKey,
                run,

                dataRef,
                showAddModal
            };
        }
    }
</script>

<style scoped>
    .s-body {
        padding: 20px;
        display: flex;
    }

    .s-item {
        width: 50%;
        flex: 0 0 50%;
        padding: 10px;
        border: 1px solid;
        border-color: #72e3f3;
        box-shadow: #72e3f3 5px 5px;
        margin: 5px;
    }

    .s-item-selected {
        background-color: #2c9300;
        color: WHITE;
    }
</style>
