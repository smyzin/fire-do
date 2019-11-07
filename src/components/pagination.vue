<template>
    <div class="pagination">
        <button
            class="pagination__btn" :class="current_page === num ? 'pagination__btn_active' : ''" v-for="num in pages" :key="num"
            @click="paginatePage(num)"
            :disabled="current_page === num"
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
                // if(num > )
                this.$emit('changePage', num)
            }
        }
    }
</script>

<style scoped>
</style>