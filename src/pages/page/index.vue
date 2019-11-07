<template>
    <div>
        <addItem @createTask="addTask" ref="addBlockComp"></addItem>
        <div class="board__container" :class="{'board__container_loading': is_loading_data}">

            <i class="fa fa-spinner fa-pulse fa-3x fa-fw" v-if="is_loading_data"></i>

            <div class="board__container-list" v-else>
                <listItem
                    v-for="(item, index) in todo"
                    :key="item.id"
                    :object="item"
                    :number="index+1"
                    @changeStatus="updateStatus"
                ></listItem>
            </div>

            <pagination :total="count" :pages="pages_amount" :current_page="current_page"
                        @changePage="getData"
                        v-if="!is_loading_data && count > 10"
            ></pagination>

        </div>

    </div>
</template>

<script>
    // import { db } from '@/main'

    import addItem from '@/components/add-item'
    import listItem from '../../components/list-item'
    import pagination from '../../components/pagination'

    export default {
        components: {
            addItem: addItem,
            listItem: listItem,
            pagination: pagination
        },
        watch: {
            count(value){
                this.pages_amount = Math.ceil(value/this.limit);
            }
        },
        data(){
            return{
                is_loading_data: true,

                todo: [],
                count: 0,
                limit: 10,
                pages_amount: 0,
                current_page: parseInt(this.$route.query.page ? this.$route.query.page : 1),
                pages: [],
            }
        },
        created(){
            this.prepareData().then((arr) => {
                this.getData();
            });

        },
        mounted(){
            setTimeout(() => {
                this.is_loading_data = false;
            }, 2500)
        },
        methods: {
            async getData(num = null){
                this.count = await this.$db.collection('todo').get().then(snap => snap.size);
                this.pages_amount = Math.ceil(this.count/this.limit);

                if(num !== null){
                    this.is_loading_data = true;
                    this.current_page = num;
                    this.current_page = isNaN(this.current_page) ? 1 : (this.current_page > this.pages_amount ? this.pages_amount : (this.current_page <= 0 ? 1 : this.current_page));
                }else{
                    this.current_page = isNaN(this.current_page) ? 1 : (this.current_page > this.pages_amount ? this.pages_amount : (this.current_page <= 0 ? 1 : this.current_page));
                }

                this.$store.commit('changePageNumber', this.current_page);

                let doc = await this.$db.collection('todo').doc(this.pages[this.current_page - 1].first).get();

                this.$db.collection('todo').orderBy('createdAt', "desc").startAt(doc).limit(this.limit)
                    .onSnapshot(response => {
                        if (!response.docs.length) {
                            console.log("No Data Available");
                            return false;
                        }
                        this.todo = [];
                        for (let item of response.docs) {
                            this.todo.push({uid: item.id, ...item.data()});
                        }
                        this.is_loading_data = false;
                    }, error => {
                        console.error('Error: ', {error});
                        this.is_loading_data = false;
                    });
            },
            async prepareData(){
                this.count = await this.$db.collection('todo').get().then(snap => snap.size);
                this.pages_amount = Math.ceil(this.count/this.limit);

                return await new Promise((resolve, reject) => {
                     this.$db.collection('todo').orderBy('createdAt', "desc").get().then(response => {
                        if (!response.docs.length) {
                            console.log("No Data Available");
                            return false;
                        }
                        this.pages = [];
                        for (let i = 0; i < this.pages_amount; i++) {
                            let first = this.limit * i;
                            let last = (this.limit * i) - 1 + this.limit;
                            this.pages.push({first: response.docs[first].id, last: response.docs[last >= this.count - 1 ? this.count -1 : last].id});
                        }
                        return resolve(this.pages)
                    }, error => {
                        console.error('Error: ', {error});
                        return reject(false)
                    });
                })
            },
            manageCount(increase){
                increase ? this.count++ : this.count--;
            },
            async generateID(){
                return await fetch('https://www.uuidgenerator.net/api/version4').then(response => Promise.resolve(response.text())).catch(error => Promise.reject(error))
            },
            async addTask(name) {
                if(!name && !name.length){
                    throw new Error(`Field 'name' should be String and consist at least 3 char`);
                }
                const createdAt = new Date();
                const updatedAt = createdAt;
                this.generateID().then(id => {
                    this.$db.collection('todo').add({ id, name, createdAt, updatedAt, done: false }).then(res => {
                        this.$refs.addBlockComp.changeLoadingState(false);
                        this.$refs.addBlockComp.resetForm();
                        this.manageCount(true);

                        this.prepareData().then(() => {
                            this.getData(1);
                        });
                    });

                }).catch(error => {
                    throw new Error(`Could not generate id for new database record and throw error ${error}`);
                });

            },
            updateStatus({uid, done}){
                this.$db.collection('todo').doc(uid).update({updatedAt: new Date(), done: !done});
            },
        }
    }
</script>

<style scoped>

</style>