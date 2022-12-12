<template>
    <div class="s-control">
        <div class="row margin-bottom-20">
            <span class="col-2">选择模式</span>
            <div class="col-6">
                <select class="form-control input-group-sm form-select form-select-sm" v-model="nowKey" @change="onSettingChange">
                    <option v-for="x in dataRef.dataSource" :value="x.key">
                        {{ x.name }}
                    </option>
                </select>
            </div>
            <button class="btn btn-outline-info btn-sm col-auto maring-right-12" @click="showAddModal">添加</button>
            <button class="btn btn-outline-info btn-sm col-auto maring-right-12" @click="showEditModal">编辑</button>
            <button class="btn btn-outline-info btn-sm col-auto" @click="showDeleteConfirm">删除</button>
        </div>
    </div>

    <div class="row margin-bottom-20" v-if="nowKey">
        <button class="btn btn-outline-info" @click="run">随机</button>
    </div>

    <div class="s-content row margin-bottom-20">
        <div v-for="x in nowSetting.items" :class="['s-item', resultKey === x.key ? 's-item-selected' : '']">
            {{x.name}}（{{x.rate * 100}}%）
            <svg v-if="resultKey === x.key" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
            </svg>
        </div>

    </div>

    <div class="row" v-if="nowKey && resultItem">
        选择了【{{resultItem.name}}】 - 生成时间：{{new Date()}}
    </div>

    <hr />

    <div class="row">
        <div>本次会话共随机了<b>{{ totalCount }}</b>次,其中 </div>
        <ul>
            <li v-for="x in nowSetting.items">
                {{x.name}}（{{x.rate * 100}}%） : <b>{{recorder.eachCount[x.key] ?? 0}}次</b>
            </li>
        </ul>
    </div>

    <editing-modal ref="editor" @submit="onSubmit">
    </editing-modal>
</template>

<script>
    import { Machine, MachineItem } from './../models/Machine';
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
        },
        {
            name: "石头剪刀布",
            items: [{
                name: "石头",
                rate: 1 / 3
            }, {
                name: "剪刀",
                rate: 1 / 3
            }, {
                name: "布",
                rate: 1 / 3
            }]
        },
        {
            name: "6点",
            items: [{
                name: "1",
                rate: 1 / 6
            }, {
                name: "2",
                rate: 1 / 6
            }, {
                name: "3",
                rate: 1 / 6
            }, {
                name: "4",
                rate: 1 / 6
            }, {
                name: "5",
                rate: 1 / 6
            }, {
                name: "6",
                rate: 1 / 6
            }]
        }
    ];
    export default {
        setup() {
            const dataRef = Vue.reactive({
                dataSource: Source.concat(JSON.parse(localStorage.getItem(StorageName) ?? "[]")).map(x => new Machine(x))
            });

            const editor = Vue.ref(null);
            const showAddModal = () => {
                Vue.unref(editor).show();
            }
            const onSubmit = () => {
                location.reload();
            }
            const showEditModal = () => {
                Vue.unref(editor).show(Vue.unref(nowSetting));
            }
            const showDeleteConfirm = () => {
                const item = Vue.unref(nowSetting);
                if (confirm(`确定删除${item.name}？`)) {
                    let m = JSON.parse(localStorage.getItem(StorageName) ?? "[]");
                    m = m.filter(x => x.key !== item.key);
                    localStorage.setItem(StorageName, JSON.stringify(m));
                    location.reload();
                }
            }

            const nowKey = Vue.ref(0);
            const nowSetting = Vue.computed(() => {
                return dataRef.dataSource.find(x => x.key === Vue.unref(nowKey)) ?? new Machine();
            });

            const resultKey = Vue.ref(0);
            const resultItem = Vue.computed(() => {
                return Vue.unref(nowSetting).items.find(x => x.key === Vue.unref(resultKey)) ?? new MachineItem();
            })

            const run = () => {
                resultKey.value = 0;
                Vue.nextTick(() => {
                    const item = Vue.unref(nowSetting).run();
                    resultKey.value = item.key;

                    totalCount.value++;
                    recorder.eachCount[resultKey.value] = (recorder.eachCount[resultKey.value] ?? 0) + 1;
                });
            }

            const onSettingChange = () => {
                resultKey.value = 0;

                totalCount.value = 0;
                recorder.eachCount = [];
            }

            const totalCount = Vue.ref(0);
            const recorder = Vue.reactive({
                eachCount: []
            });

            return {
                nowKey,
                nowSetting,

                resultKey,
                resultItem,

                run,
                totalCount,
                recorder,

                dataRef,
                editor,
                onSubmit,
                showAddModal,
                showEditModal,
                showDeleteConfirm,

                onSettingChange
            };
        }
    }
</script>

<style scoped>
    .s-item {
        flex: 0 0 calc(50% - 10px);
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
