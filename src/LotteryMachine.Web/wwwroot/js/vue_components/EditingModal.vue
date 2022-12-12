<template>
    <bootstrap-modal ref="modal">
        <template #modal-header>
            编辑框
        </template>
        <template #modal-body>
            <div class="body-container">
                <div class="row">
                    <div class="col-3">名称</div>
                    <div class="col-9">
                        <input class="form-control form-control-sm" v-model="dataRef.editingModel.name" />
                    </div>
                </div>
                <hr />
                <div v-for="item in dataRef.editingModel.items" :key="item.key" class="row item">
                    <div class="col-3">
                        <div class="form-label">名称</div>
                        <div class="form-label">比例</div>
                    </div>
                    <div class="col-6">
                        <div>
                            <input class="form-control form-control-sm" v-model="item.name" />
                        </div>
                        <div>
                            <input class="form-control form-control-sm" type="number" v-model="item.rate" />
                        </div>
                    </div>
                    <div class="col-3">
                        <button class="btn btn-danger" @click="removeItem(item)">删除</button>
                    </div>
                </div>
                <button class="btn btn-outline-info btn-sm" style="width: 100%" @click="addItem">添加项</button>
                <button class="btn btn-outline-secondary btn-sm" style="width: 100%" @click="autoSet">平均</button>
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

    const addItem = () => {
        dataRef.editingModel.addItem();
    }

    const removeItem = (item) => {
        dataRef.editingModel.removeItem(item);
    }

    const autoSet = () => {
        dataRef.editingModel.autoSet();
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

    const show = (model) => {
        dataRef.editingModel = model?.clone() ?? new Machine();

        modal.value.show();
    }

    defineExpose({
        show
    });
</script>

<style scoped>
    .form-label {
        height: 31px;
    }
    .body-container > .item:not(:last-child) {
        padding-bottom: 12px;
    }
</style>