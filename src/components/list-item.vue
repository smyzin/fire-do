<template>
    <div class="item">
        <div class="item__wrapper" :class="object.done ? 'item__wrapper_done': ''">
            <div class="item__name" :class="object.done ? 'item__name_done': ''" @click="!$store.state.is_disabled ? changeStatus({ uid, done }) : ''">{{ object.name }}</div>
            <div class="item__actions">
                <button
                    class="item__actions-btn"
                    :class="{
                        'item__actions_disabled': $store.state.is_disabled,
                        'item__actions_detail': !$store.state.is_disabled
                    }"
                    :disabled="$store.state.is_disabled"
                    @click="$router.push(`/${object.uid}`)"
                >
                    <i class="fa fa-info" ></i>
                </button>
                <button
                    class="item__actions-btn "
                    :class="{
                        'item__actions_disabled': $store.state.is_disabled,
                        'item__actions_delete': !$store.state.is_disabled
                    }"
                    :disabled="$store.state.is_disabled"
                    @click="removeItem(object.uid)"
                >
                    <i class="fa fa-times details__actions_delete-icon"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'

    export default {
        props: {
            object: {
                type: Object,
                required: true,
                default: () => { return {}}
            },
            number: {
                type: Number
            }
        },
        data(){
            return{
                is_sending: true
            }
        },
        methods: {
            ...mapActions({
                removeTask: 'removeTask',
                getData: 'updateTodoList',
                prepareData: 'getBreakPoints',
                updateStatus: 'updateTaskStatus',

                updateDisabledStatus: 'updateDisabledStatus'
            }),
            changeStatus({uid, done}){
                this.updateStatus({uid, done});
            },
            removeItem(uid){
                this.updateDisabledStatus(true);

                this.removeTask(uid).then(result => {
                    this.prepareData().then(() => {
                        if(this.$store.state.count_pages < this.$store.state.current_page){
                            this.$store.commit('changePageNumber',  this.$store.state.count_pages)
                        }
                        this.getData().then(res => {
                            this.updateDisabledStatus(false);
                        });
                    });
                });
            }
        }
    }
</script>

<style lang="scss">

</style>