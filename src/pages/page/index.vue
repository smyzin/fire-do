<template>
    <div>
        <addItem @createTask="addTask" ref="addBlockComp"></addItem>
        <div class="board__container" :class="{'board__container_loading': is_loading_data}">

            <i class="fa fa-spinner fa-pulse fa-3x fa-fw" v-if="is_loading_data"></i>

            <div class="board__container-list" v-else>
                <listItem
                    v-for="(item, index) in $store.state.todo"
                    :key="item.id"
                    :object="item"
                    :number="index+1"
                    @changeStatus="updateStatus"
                ></listItem>
            </div>

            <pagination
                :total="$store.state.count_tasks"
                :pages="$store.state.count_pages"
                :current_page="$store.state.current_page"
                @changePage="navigatePage"
                v-if="!is_loading_data && $store.state.count_tasks > 10"
            ></pagination>

        </div>

    </div>
</template>

<script>
    import addItem from '@/components/add-item'
    import listItem from '../../components/list-item'
    import pagination from '../../components/pagination'

    import { mapActions } from 'vuex'

    export default {
        components: {
            addItem: addItem,
            listItem: listItem,
            pagination: pagination
        },
        data(){
            return{
                is_loading_data: true,
            }
        },
        created(){
            if(!this.$store.state.todo.length){
                this.prepareData().then((arr) => {
                    this.formatCurrentPage(parseInt(this.$route.query.page ? this.$route.query.page : 1));
                    this.getData().then(result => {
                        this.is_loading_data = false;
                    });
                });
            }else{
                this.is_loading_data = false;
            }
        },
        mounted(){ },
        methods: {
            ...mapActions({
                prepareData: 'getBreakPoints',
                getData: 'updateTodoList',
                createTask: 'createTask',

                updateStatus: 'updateTaskStatus',

                updateDisabledStatus: 'updateDisabledStatus'
            }),
            formatCurrentPage(current_page){
                this.$store.commit('changePageNumber',  isNaN(current_page) ?
                    1 : (current_page > this.$store.state.count_pages ?
                        this.$store.state.count_pages : (current_page <= 0 ?
                            1 : current_page)
                    )
                );
            },
            navigatePage(page){
                this.is_loading_data = true;
                this.formatCurrentPage(page);

                this.getData().then(result => {
                    this.is_loading_data = false;
                });
            },
            async generateID(){
                return await fetch('https://www.uuidgenerator.net/api/version4').then(response => Promise.resolve(response.text())).catch(error => Promise.reject(error))
            },
            async addTask(name) {
                if(!name && !name.length){
                    throw new Error(`Field 'name' should be String and consist at least 3 char`);
                }

                this.updateDisabledStatus(true);
                this.generateID().then(id => {
                    this.createTask({id, name}).then(result => {
                        this.prepareData().then(() => {
                            this.formatCurrentPage(1);
                            this.getData().then(res => {
                                this.$refs.addBlockComp.resetForm();
                            });
                        });
                    })
                }).catch(error => {
                    throw new Error(`Could not generate id for new database record and throw error ${error}`);
                });

            },
        }
    }
</script>

<style scoped>

</style>