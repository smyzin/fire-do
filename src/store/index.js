import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/main'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        is_disabled: false,

        current_page: 1,
        count_tasks: 0,
        count_pages: 0,
        limit: 10,
        todo: [],
        todo_breakpoints: [],
        task: {}
    },
    mutations: {
        updateDisabledStatus(state, value = false){
            state.is_disabled = value;
        },
        updateTodoBreakPoints(state, array){
            state.todo_breakpoints = array;
        },
        updateCountTasksPages(state, {tasks, pages}){
            state.count_tasks = tasks;
            state.count_pages = pages;
        },
        updateTodoList(state, array){
            state.todo = array;
        },
        changePageNumber(state, number = 1){
            state.current_page = number;
        },
        updateStatus(state, {uid, done}){
            let index = state.todo.findIndex(item => item.uid === uid);
            index >= 0 ? state.todo[index].done = !done : '';
        },
        getSingleTask(state, object = {}){
            state.task = object
        },
        updateTask(state, {uid, name, updatedAt, done}){
            let index = state.todo.findIndex(item => item.uid === uid);
            if(index >= 0) {
                state.todo[index].name = name;
                state.todo[index].updatedAt = updatedAt;
                state.todo[index].done = done;
            }
            state.task.name = name;
            state.task.updatedAt = updatedAt;
            state.task.done = done;
        }
    },
    actions: {
        async getBreakPoints({commit, dispatch, state}){
            let count_tasks = await db.collection('todo').get().then(snap => snap.size),
                count_pages = Math.ceil(count_tasks/state.limit);

            return db.collection('todo').orderBy('createdAt', "desc").get().then(async response => {
                if (!response.docs.length) {
                    console.log("No Data Available");
                    return Promise.reject(false);
                }

                let pages = [];
                for (let i = 0; i < count_pages; i++) {
                    let first = state.limit * i;
                    let last = (state.limit * i) - 1 + state.limit;
                    await pages.push({first: response.docs[first].id, last: response.docs[last >= count_tasks - 1 ? count_tasks -1 : last].id});
                }

                commit('updateCountTasksPages', {tasks: count_tasks, pages: count_pages});
                commit('updateTodoBreakPoints', await pages);

                return Promise.resolve(await pages)
            }, error => {
                console.error('Error: ', {error});
                return Promise.reject(false);
            });
        },
        async updateTodoList({state, commit, dispatch}){
            let doc = await db.collection('todo').doc(state.todo_breakpoints[state.current_page - 1].first).get();

            return db.collection('todo').orderBy('createdAt', "desc").startAt(doc).limit(state.limit)
                .get().then(async response => {
                    if (!response.docs.length) {
                        console.log("No Data Available");
                        return Promise.reject(false);
                    }
                    let todo_list = await response.docs.map(item => {
                        return {uid: item.id, ...item.data()};
                    });
                    commit('updateTodoList', await todo_list);

                    return Promise.resolve(true);
                }, error => {
                    console.error('Error: ', {error});
                    return Promise.reject(false);
                });
        },
        getSingleTask({commit, dispatch, state}, uid){
            if(uid !== state.task.uid){
                return db.collection('todo').doc(uid).get().then(async doc => {
                    let task = {uid: uid, ...await doc.data()};

                    commit('getSingleTask', await task);

                    return Promise.resolve(task);
                }).catch(error => {
                    return Promise.reject(error);
                });
            }

        },


        createTask({commit, dispatch, state}, {id, name}){
            const createdAt = new Date();
            const updatedAt = createdAt;

            return db.collection('todo').add({ id, name, createdAt, updatedAt, done: false }).then(response => {
                return Promise.resolve(response)
            }).catch(error => {
                return Promise.reject(error)
            });
        },
        updateTaskStatus({commit, dispatch, state}, {uid, done}){
            db.collection('todo').doc(uid).update({updatedAt: new Date(), done: !done});
        },
        removeTask({commit, dispatch, state}, uid){
            return db.collection('todo').doc(uid).delete().then(response => {
                return Promise.resolve(response)
            }).catch(error => {
                return Promise.reject(error)
            });
        },
        updateTask({commit, dispatch, state}, {uid, name, updatedAt, done}){
            return db.collection('todo').doc(uid).update({name, updatedAt, done}).then(response => {
                commit('updateTask', {uid, name, updatedAt, done});
                return Promise.resolve(response)
            }).catch(error => {
                return Promise.reject(error)
            });
        },


        updateDisabledStatus({state, commit, dispatch}, disabled = false){
            commit('updateDisabledStatus', disabled);
        }
    },
    modules: {}
})
