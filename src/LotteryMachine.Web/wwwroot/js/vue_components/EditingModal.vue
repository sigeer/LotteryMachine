<template>
    <bootstrap-modal ref="modal">
        <template #modal-header>
            编辑框
        </template>
        <template #modal-body>
            <div class="body-container">
                <div class="row">
                    <div class="col-4">名称</div>
                    <div class="col-8">
                        <input class="form-control form-control-sm" v-model="dataRef.editingModel.name" />
                    </div>
                </div>
                <hr />
                <div v-for="item in dataRef.editingModel.items" :key="item.key" class="row item">
                    <div class="row">
                        <div class="col-4">名称</div>
                        <div class="col-4">
                            <input class="form-control form-control-sm" v-model="item.name" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">比例</div>
                        <div class="col-4">
                            <input class="form-control form-control-sm" type="number" v-model="item.rate" />
                        </div>
                    </div>
                </div>
                <button class="btn btn-outline-info" style="width: 100%" @click="addItem">添加项</button>
            </div>
        </template>
        <template #modal-footer>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="submit">确定</button>
        </template>
    </bootstrap-modal>
</template>

<script setup>
    import { Machine, MachineItem } from './../models/Machine';

    const modal = Vue.ref(null);

    const dataRef = Vue.reactive({
        editingModel: new Machine()
    });

    const show = (model) => {
        dataRef.editingModel = model ?? new Machine();

        modal.value.show();
    }

    const addItem = () => {
        dataRef.editingModel.addItem();
    }

    const equal = (model, other) => {
        if (!model)
            return false;

        if (model.name === other.name && model.items.length == other.items.length) {
            for (var i = 0; i < other.items.length; i++) {
                if (!model.items.some(x => x.name === other.items[i].name && x.rate === other.items[i].rate))
                    return false;
            }
            return true;
        }
        return false;
    }

    const emit = defineEmits(['submit']);

    const submit = () => {
        if (!dataRef.editingModel.validate()) {
            alert("所有项的和应当为1");
            return;
        }

        let m = JSON.parse(localStorage.getItem(StorageName) ?? "[]");
        if (!m.some(x => equal(x, dataRef.editingModel))) {
            m.push(dataRef.editingModel);
            localStorage.setItem(StorageName, JSON.stringify(m));
            modal.value.hide();
            emit('submit');
        } else {
            alert("设置已存在");
        }
    }

    defineExpose({
        show
    });
</script>

<style scoped>
    .body-container > .item:not(:last-child) {
        padding-bottom: 12px;
    }
</style>