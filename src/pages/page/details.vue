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
            <span class="details__value" v-else>{{ task.name }}</span>
        </div>
        <div class="details__block details__block-id">
            <span class="details__label">Task's ID: </span>
            <span class="details__value">{{ task.id }}</span>
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
                @click="!is_edit ? is_edit = !is_edit : (new_name.length < 3 || new_name.length > 200 ? is_edit = false : updateTask({uid, name: new_name}))"
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
            <button
                class="details__actions-btn"
                :class="{
                    'details__actions_disabled': is_sending,
                    'details__actions_delete': !is_sending
                }"
                @click="removeTask(uid)"
                :disabled="is_sending"
            >
                <i class="fa fa-trash details__actions_delete-icon"></i>
                {{ !is_edit ? 'Delete' : 'Cancel' }}
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            form_date(){
                return this.$dateFormater(this.task.updatedAt);
            },
            sliced_name(){
                return this.task.name.length > 50 ? `${this.task.name.slice(0, 50)}...` : this.task.name;
            }
        },
        watch: {
            is_edit(state){
                if(state){
                    this.new_name = this.task.name;
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
                is_sending: false,
                new_name: '',

                task: {},
                uid: this.$route.params.id
            }
        },
        created(){
            this.$db.collection('todo')
                .doc(this.uid)
                .get()
                .then(doc => {
                    this.task = doc.data();
                    this.is_loading_data = false;
                });
        },
        methods: {
            resetInput(){
                this.is_edit = false;
            },
            updateTask({uid, name}){
                if(name !== this.task.name){
                    const date = new Date();
                    this.is_sending = true;

                    this.$db.collection('todo').doc(uid).update({updatedAt: date, name: name}).then(() => {
                        this.task.updatedAt = date;
                        this.task.name =  name;
                        this.is_sending = false;
                    });
                }
                this.resetInput();
            },

            removeTask(uid){
                this.is_sending = true;
                let date = new Date()
                this.$db.collection('todo').doc(uid).update({updatedAt: date, deletedAt: date}).then(res => {
                    this.$db.collection('todo').doc(uid).delete().then(() => {
                        this.$router.push(`/?page=${this.$store.state.current_page}`);
                        this.is_sending = false;
                    });
                });
            },
        }
    }
</script>

<style scoped>

</style>