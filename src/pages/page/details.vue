<template>
    <i class="fa fa-spinner fa-pulse fa-3x fa-fw details_loading" v-if="is_loading_data"></i>
    <div class="details" v-else>
        <div class="details__header">
            <button @click="$router.push(`/?page=${$store.state.current_page}`)">
                <i class="fa fa-arrow-left"></i>
            </button>
            <h1>{{ sliced_name }}</h1>
        </div>
        <div class="details__block details__block-name">
            <span class="details__label">Name: </span>
            <input
                ref="itemBlockInput"
                v-if="is_edit"
                class="item__name-input"
                v-model="new_name"
                :disabled="is_sending"
                type="text"
                :max="200"
                :maxlength="200"
                placeholder="Enter task's name"
                @keyup.esc="resetInput"
                @keyup.enter="new_name.length < 3 || new_name.length > 200 ? '' : updateTask({uid, name: new_name})"
            >
            <span class="details__value" v-else>{{ $store.state.task.name }}</span>
        </div>
        <div class="details__block details__block-id">
            <span class="details__label">Status: </span>
            <div v-if="is_edit">
                <input
                    type="radio"
                    id="contactChoice1"
                    :value="true"
                    v-model="is_done"
                >
                <label for="contactChoice1">Done</label>

                <input
                    type="radio"
                    id="contactChoice2"
                    :value="false"
                    v-model="is_done"
                >
                <label for="contactChoice2">Open</label>
            </div>
            <span class="details__value" v-else>{{ $store.state.task.done ? 'Done' : 'Open' }}</span>
        </div>
        <div class="details__block details__block-id">
            <span class="details__label">Task's ID: </span>
            <span class="details__value">{{ $store.state.task.id }}</span>
        </div>
        <div class="details__block details__block-update">
            <span class="details__label">Updated at: </span>
            <span class="details__value">{{ form_date }}</span>
        </div>

        <div class="details__actions">
            <button
                class="details__actions-btn"
                :class="{
                    'details__actions_disabled': is_sending,
                    'details__actions_edit': !is_edit && !is_sending,
                    'details__actions_save': is_edit
                }"
                @click="!is_edit ? is_edit = !is_edit : (new_name.length < 3 || new_name.length > 200 ? is_edit = false : updateSingleTask({uid, name: new_name, done: is_done}))"
                :disabled="is_sending"
            >
                <i
                    class="fa"
                    :class="{
                        'fa-pencil': !is_edit,
                        'fa-spinner fa-pulse fa-fw': is_sending,
                        'fa-check': new_name.length,
                        'fa-close': new_name.length < 3 || new_name.length > 200,
                        'details__actions_edit-icon': !is_edit,
                        'details__actions_save-icon': is_edit
                    }"
                ></i>
                {{ !is_edit ? (!is_sending ?'Edit' : 'Saving') : 'Save' }}
            </button>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        computed: {
            form_date(){
                return this.$dateFormater(this.$store.state.task.updatedAt);
            },
            sliced_name(){
                return this.$store.state.task.name.length > 50 ? `${this.$store.state.task.name.slice(0, 50)}...` : this.$store.state.task.name;
            }
        },
        watch: {
            is_edit(state){
                if(state){
                    this.new_name = this.$store.state.task.name;
                    this.is_done = this.$store.state.task.done;
                    setTimeout(() => {
                        this.$refs.itemBlockInput.focus()
                    }, 10)
                }else{
                    this.new_name = '';
                }
            }
        },
        data(){
            return{
                is_loading_data: true,
                is_edit: false,
                is_done: false,
                is_sending: false,
                new_name: '',

                uid: this.$route.params.id
            }
        },
        created(){
            this.getSingleTask(this.uid).then(() => {
                this.is_loading_data = false;
            });
        },
        methods: {
            ...mapActions({
                getSingleTask: 'getSingleTask',
                updateTask: 'updateTask'
            }),
            resetInput(){
                this.is_edit = false;
            },
            updateSingleTask({uid, name, done}){
                if(name !== this.$store.state.task.name){
                    this.is_sending = true;

                    this.updateTask({uid, name, updatedAt: new Date(), done}).then(() => {
                        this.is_sending = false;
                        this.resetInput();
                    });
                }else{
                    this.resetInput();
                }
            }
        }
    }
</script>

<style scoped>

</style>