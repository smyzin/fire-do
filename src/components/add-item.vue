<template>
    <div class="add-block">
        <input
            ref="addBlockInput"
            v-if="is_opened"
            class="add-block__input"
            :disabled="$store.state.is_disabled"
            v-model="name" type="text"
            :max="200"
            :maxlength="200"
            placeholder="Enter task's name"
            @keyup.esc="resetForm"
            @keyup.enter="name.length < 3 || name.length > 200 ? '' : createNewTask()"
        >

        <button
            :class="{
                'add-block__btn_disabled': $store.state.is_disabled,
                'add-block__btn_small': is_opened,
                'add-block__btn_huge': !is_opened
            }"
            class="add-block__btn"
            :disabled="$store.state.is_disabled"
            @click="is_opened ? (name.length < 3 || name.length > 200 ? resetForm() : createNewTask()) : is_opened = !is_opened"

        >
            <i class="fa add-block__btn-icon"
               :class="{
                'fa-spinner fa-pulse fa-3x fa-fw': $store.state.is_disabled && is_sending,
                'fa-plus': !$store.state.is_disabled,
                'add-block__btn-icon_rotate': is_opened? name.length < 3 || name.length > 200 : false
               }" ref="addBtnIcon"></i>

            <span v-if="!is_opened">Add new task</span>
        </button>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        watch: {
            is_opened(state){
                if(state){
                    setTimeout(() => {
                        this.$refs.addBlockInput.focus()
                    }, 10)
                }
            }
        },
        data(){
            return{
                is_opened: false,
                is_sending: false,
                name: ''
            }
        },
        methods: {
            ...mapActions({
                updateDisabledStatus: 'updateDisabledStatus'
            }),
            resetForm(){
                this.name = '';
                this.is_opened = false;
                this.is_sending = false;
                this.is_sending = false;
                this.updateDisabledStatus(false);
            },
            createNewTask(){
                this.is_sending = true;
                this.$emit('createTask', this.name);
            }
        }
    }
</script>

<style lang="scss">

</style>