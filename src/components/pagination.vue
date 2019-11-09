<template>
    <div class="pagination">
        <button
            class="pagination__btn"
            :class="{
                'pagination__btn_active': current_page === num || $store.state.is_disabled

            }" v-for="num in pages" :key="num"
            @click="paginatePage(num)"
            :disabled="current_page === num || $store.state.is_disabled"
        >
            <span>
                {{ num }}
            </span>
        </button>
    </div>
</template>

<script>
    export default {
        props: {
            total: {
                type: Number,
                default: 1
            },
            pages: {
                type: Number,
                default: 1
            },
            current_page: {
                type: Number,
                default: 1
            }
        },
        methods: {
            paginatePage(num){
                this.$emit('changePage', num)
            }
        }
    }
</script>

<style scoped>
</style>