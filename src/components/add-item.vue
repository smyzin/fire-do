<template>
    <div class="add-block">
        <input
            ref="addBlockInput"
            v-if="is_opened"
            class="add-block__input"
            :disabled="is_sending"
            v-model="name" type="text"
            :max="200"
            :maxlength="200"
            placeholder="Enter task's name"
            @keyup.esc="resetForm"
            @keyup.enter="name.length < 3 || name.length > 200 ? '' : createNewTask()"
        >

        <button
            :class="is_opened ? 'add-block__btn_small' : 'add-block__btn_huge'"
            class="add-block__btn"
            :disabled="is_sending"
            @click="is_opened ? (name.length < 3 || name.length > 200 ? resetForm() : createNewTask()) : is_opened = !is_opened"

        >
            <i class="fa add-block__btn-icon"
               :class="{
                'fa-spinner fa-pulse fa-3x fa-fw': is_sending,
                'fa-plus': !is_sending,
                'add-block__btn-icon_rotate': is_opened? name.length < 3 || name.length > 200 : false
               }" ref="addBtnIcon"></i>

            <span v-if="!is_opened">Add new task</span>
        </button>
    </div>
</template>

<script>
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
            resetForm(){
                this.name = '';
                this.is_opened = false;
                this.is_sending = false;
            },
            createNewTask(){
                this.changeLoadingState(true);

                this.$emit('createTask', this.name);
            },
            changeLoadingState(state){
                this.is_sending = state;
            }
        }
    }
</script>

<style lang="scss">

</style>