<template>
    <div class="modal" tabindex="-1" :id="instance">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="modal-header">
                        <h5 class="modal-title">{{props.title}}</h5>
                    </slot>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot name="modal-body"></slot>
                </div>
                <div class="modal-footer">
                    <slot name="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary">确定</button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const nowGuid = guid();
    const instance = Vue.ref(nowGuid);

    let modal = null;

    const props = defineProps({
        title: String
    });

    const show = () => {
        modal.show();
    }
    const hide = () => {
        modal.hide();
    }

    Vue.onMounted(() => {
        modal = new bootstrap.Modal(document.getElementById(nowGuid), {
            backdrop: 'static',
            keyboard: false
        });
    });

    defineExpose({
        show,
        hide
    });
</script>