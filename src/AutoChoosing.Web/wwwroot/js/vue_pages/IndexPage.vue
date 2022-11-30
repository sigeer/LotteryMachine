<template>
    <div class="s-control">
        <div>
            <span>选择模式</span>
            <select v-model="nowKey">
                <option v-for="x in dataRef.dataSource" :value="x.key">
                    {{ x.name }}
                </option>
            </select>
            <button @click="showAddModal">添加</button>
        </div>

        <div>

        </div>
    </div>

    <div class="s-content">
        <div>
            <button @click="run">随机</button>
        </div>
        <div class="s-body">
            <div v-for="x in nowSetting.items">
                <div :class="['s-item', resultKey === x.key ? 's-item-selected' : '']">
                    {{x.name}}（{{x.rate * 100}}%）
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import { Machine } from './../models/Machine';
    const Source = [
        {
            name: "是否",
            items: [{
                name: "是",
                rate: 0.5
            }, {
                name: "否",
                rate: 0.5
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
    .s-body{
        padding: 50px;
    }

    .s-item-selected {
        color: #4cff00
    }
</style>
